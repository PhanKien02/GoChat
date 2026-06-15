package conversation

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// ConversationRepository defines CRUD operations for conversations.
// Methods mirror the style used in the user repository: they accept a context
// and use bson.ObjectID for IDs to match the rest of the codebase.
type ConversationRepository interface {
	CreateConversation(ctx context.Context, conv *Conversation) error
	GetConversationByID(ctx context.Context, id bson.ObjectID) (*Conversation, error)
	UpdateConversation(ctx context.Context, id bson.ObjectID, conv *Conversation) error
	DeleteConversation(ctx context.Context, id bson.ObjectID) error
}

type conversationRepository struct {
	client       *mongo.Client
	conversation *mongo.Collection
}

func NewConversationRepository(client *mongo.Client, dbName, collectionName string) ConversationRepository {
	coll := client.Database(dbName).Collection(collectionName)

	// Create a text index for the conversation name (useful for searching)
	indexModel := mongo.IndexModel{
		Keys: bson.D{{Key: "name", Value: "text"}},
	}
	_, err := coll.Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		log.Printf("Warning: Failed to create text index for conversations: %v", err)
	}

	return &conversationRepository{
		client:       client,
		conversation: coll,
	}
}

func (r *conversationRepository) CreateConversation(ctx context.Context, conv *Conversation) error {
	_, err := r.conversation.InsertOne(ctx, conv)
	return err
}

func (r *conversationRepository) GetConversationByID(ctx context.Context, id bson.ObjectID) (*Conversation, error) {
	var conv Conversation
	if err := r.conversation.FindOne(ctx, bson.M{"_id": id}).Decode(&conv); err != nil {
		return nil, err
	}
	return &conv, nil
}

func (r *conversationRepository) UpdateConversation(ctx context.Context, id bson.ObjectID, conv *Conversation) error {
	_, err := r.conversation.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": conv})
	return err
}

func (r *conversationRepository) DeleteConversation(ctx context.Context, id bson.ObjectID) error {
	_, err := r.conversation.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
