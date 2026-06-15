package conversation

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type ConversationService interface {
	CreateConversation(ctx context.Context, conv *Conversation) error
	GetConversationByID(ctx context.Context, id bson.ObjectID) (*Conversation, error)
	UpdateConversation(ctx context.Context, id bson.ObjectID, conv *Conversation) error
	DeleteConversation(ctx context.Context, id bson.ObjectID) error
}

type conversationService struct {
	repo ConversationRepository
}

func NewConversationService(repo ConversationRepository) ConversationService {
	return &conversationService{
		repo: repo,
	}
}

func (s *conversationService) CreateConversation(ctx context.Context, conv *Conversation) error {
	return s.repo.CreateConversation(ctx, conv)
}

func (s *conversationService) GetConversationByID(ctx context.Context, id bson.ObjectID) (*Conversation, error) {
	return s.repo.GetConversationByID(ctx, id)
}

func (s *conversationService) UpdateConversation(ctx context.Context, id bson.ObjectID, conv *Conversation) error {
	return s.repo.UpdateConversation(ctx, id, conv)
}

func (s *conversationService) DeleteConversation(ctx context.Context, id bson.ObjectID) error {
	return s.repo.DeleteConversation(ctx, id)
}
