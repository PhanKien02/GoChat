package user

import (
	"GoChat/shared/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoutes(rg *gin.RouterGroup, handler *UserHandler) {
	userGroup := rg.Group("/users")
	userGroup.Use(middleware.JWTMiddleware())
	{
		userGroup.GET("/:id", handler.GetUserHandler)
	}
}
