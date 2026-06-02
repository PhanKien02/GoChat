package appRouter

import (
	"GoChat/internal/user"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetUpRouter(
	rg *gin.RouterGroup,
	client *mongo.Client,
) {
	user.UserRoutes(rg, client)
}
