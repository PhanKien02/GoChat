package user

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *UserModel) error
	GetUserByID(ctx context.Context, id string) (*UserModel, error)
	GetUserByEmail(ctx context.Context, email string) *UserModel
	UpdateUser(ctx context.Context, id string, user *UserModel) error
	DeleteUser(ctx context.Context, id string) error
}

type userRepository struct {
	client *mongo.Client
	users  *mongo.Collection
}

func NewUserRepository(client *mongo.Client, dbName, collectionName string) UserRepository {
	return &userRepository{
		client: client,
		users:  client.Database(dbName).Collection(collectionName),
	}
}
func (r *userRepository) CreateUser(ctx context.Context, user *UserModel) error {
	_, err := r.users.InsertOne(ctx, user)
	return err
}
func (r *userRepository) GetUserByID(ctx context.Context, id string) (*UserModel, error) {
	var user UserModel

	if err := r.users.FindOne(ctx, bson.M{"_id": id}).Decode(&user); err != nil {
		return nil, err
	}
	return &user, nil
}
func (r *userRepository) GetUserByEmail(ctx context.Context, email string) *UserModel {
	var user UserModel

	if err := r.users.FindOne(ctx, bson.M{"email": email}).Decode(&user); err != nil {
		return nil
	}
	return &user
}
func (r *userRepository) UpdateUser(ctx context.Context, id string, user *UserModel) error {
	_, err := r.users.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": user})
	return err
}
func (r *userRepository) DeleteUser(ctx context.Context, id string) error {
	_, err := r.users.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
