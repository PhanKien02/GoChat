package conversation

import (
	"GoChat/shared/middleware"

	"github.com/gin-gonic/gin"
)

func ConversationRoutes(rg *gin.RouterGroup, handler *ConversationHandler) {
	conversationGroup := rg.Group("/conversations")
	conversationGroup.Use(middleware.JWTMiddleware())
	{
		conversationGroup.GET("/:id", handler.GetConversation)
		conversationGroup.GET("/", handler.GetAllConversations)
		conversationGroup.POST("/", handler.CreateConversation)
		conversationGroup.PUT("/:id", handler.UpdateConversation)
		conversationGroup.DELETE("/:id", handler.DeleteConversation)
	}
}
