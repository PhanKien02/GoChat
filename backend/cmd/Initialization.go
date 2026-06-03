package cmd

import (
	"GoChat/internal/auth"
	"GoChat/internal/user"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Initialization struct {
	UserRepository user.UserRepository
	UserService    user.UserService
	UserHandler    *user.UserHandler
	AuthHandler    *auth.AuthHandler
}

func NewInitialization(client *mongo.Client) *Initialization {
	//* user
	user_repo := user.NewUserRepository(client, "gochat", "users")
	user_service := user.NewUserService(user_repo)
	user_handler := user.NewUserHandler(user_service)

	//* auth
	auth_service := auth.NewAuthService(user_service)
	auth_handler := auth.NewAuthHandler(auth_service)

	return &Initialization{
		UserRepository: user_repo,
		UserService:    user_service,
		UserHandler:    user_handler,
		AuthHandler:    auth_handler,
	}
}
