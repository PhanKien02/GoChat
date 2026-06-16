package conversation

import (
	"context"
)

type ConversationService interface {
	CreateConversation(ctx context.Context, conv *Conversation) error
	GetConversationByID(ctx context.Context, id string) (*Conversation, error)
	GetAllConversations(ctx context.Context, userId string, query GetAllConversationQuery) (*[]Conversation, error)
	UpdateConversation(ctx context.Context, id string, conv *Conversation) error
	DeleteConversation(ctx context.Context, id string) error
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

func (s *conversationService) GetConversationByID(ctx context.Context, id string) (*Conversation, error) {
	return s.repo.GetConversationByID(ctx, id)
}

func (s *conversationService) GetAllConversations(ctx context.Context, userId string, query GetAllConversationQuery) (*[]Conversation, error) {
	return s.repo.GetAllConversations(ctx, userId, query)
}

func (s *conversationService) UpdateConversation(ctx context.Context, id string, conv *Conversation) error {
	return s.repo.UpdateConversation(ctx, id, conv)
}

func (s *conversationService) DeleteConversation(ctx context.Context, id string) error {
	return s.repo.DeleteConversation(ctx, id)
}
