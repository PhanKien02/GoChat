package user

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *UserModel) error
	GetUserByID(ctx context.Context, id bson.ObjectID) *UserModel
	GetUserByEmail(ctx context.Context, email string) *UserModel
	UpdateUser(ctx context.Context, id bson.ObjectID, user *UserModel) error
	GetAllUser(ctx context.Context, query GetAllUserQuery) (*[]UserModel, error)
	DeleteUser(ctx context.Context, id bson.ObjectID) error
}

type userRepository struct {
	client *mongo.Client
	users  *mongo.Collection
}

func NewUserRepository(client *mongo.Client, dbName, collectionName string) UserRepository {
	coll := client.Database(dbName).Collection(collectionName)

	// Tạo text index cho username và email
	indexModel := mongo.IndexModel{
		Keys: bson.D{
			{Key: "username", Value: "text"},
			{Key: "email", Value: "text"},
		},
	}
	_, err := coll.Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		log.Printf("Warning: Failed to create text index for users: %v", err)
	}

	return &userRepository{
		client: client,
		users:  coll,
	}
}
func (r *userRepository) CreateUser(ctx context.Context, user *UserModel) error {
	_, err := r.users.InsertOne(ctx, user)
	return err
}
func (r *userRepository) GetUserByID(ctx context.Context, id bson.ObjectID) *UserModel {
	var user UserModel

	if err := r.users.FindOne(ctx, bson.M{"_id": id}).Decode(&user); err != nil {
		return nil
	}
	return &user
}
func (r *userRepository) GetUserByEmail(ctx context.Context, email string) *UserModel {
	var user UserModel

	if err := r.users.FindOne(ctx, bson.M{"email": email}).Decode(&user); err != nil {
		return nil
	}
	return &user
}
func (r *userRepository) UpdateUser(ctx context.Context, id bson.ObjectID, user *UserModel) error {
	_, err := r.users.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": user})
	return err
}
func (r *userRepository) DeleteUser(ctx context.Context, id bson.ObjectID) error {
	_, err := r.users.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *userRepository) GetAllUser(ctx context.Context, query GetAllUserQuery) (*[]UserModel, error) {
	var users []UserModel
	filter := bson.M{}
	if query.SearchKeyword != "" {
		filter = bson.M{
			"$text": bson.M{
				"$search": query.SearchKeyword,
			},
		}
	}
	fmt.Print(filter, query)
	opts := options.Find()
	if query.SearchKeyword != "" {
		opts.SetSort(bson.D{{Key: "score", Value: bson.M{"$meta": "textScore"}}})
	}
	opts.SetSkip(int64((query.Page - 1) * query.Limit))
	opts.SetLimit(int64(query.Limit))

	cursor, err := r.users.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	if err = cursor.All(ctx, &users); err != nil {
		return nil, err
	}
	return &users, nil
}
