package auth

import (
	"github.com/gin-gonic/gin"
)

func AuthRoutes(rg *gin.RouterGroup, handler *AuthHandler) {
	authGroup := rg.Group("/auth")
	{
		authGroup.POST("/register", handler.RegisterHandler)
		authGroup.POST("/login", handler.LoginHandler)
	}
}
