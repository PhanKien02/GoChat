package user

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func UserRoutes(rg *gin.RouterGroup, client *mongo.Client) {
	// Khởi tạo (DI) riêng cho module user
	repo := NewUserRepository(client, "gochat", "users")
	svc := NewUserService(repo)
	handler := NewUserHandler(svc)

	// Các API liên quan đến user (ví dụ: /api/users/signup)
	userGroup := rg.Group("/users")
	{
		userGroup.POST("/signup", handler.CreateUserHandler)
		userGroup.POST("/login", handler.LoginHandler)
		userGroup.GET("/:id", handler.GetUserHandler)
	}
}
