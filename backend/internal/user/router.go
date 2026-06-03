package user

import (
	"github.com/gin-gonic/gin"
)

func UserRoutes(rg *gin.RouterGroup, handler *UserHandler) {
	// Khởi tạo (DI) riêng cho module user

	// Các API liên quan đến user (ví dụ: /api/users/signup)
	userGroup := rg.Group("/users")
	{
		userGroup.GET("/:id", handler.GetUserHandler)
	}
}
