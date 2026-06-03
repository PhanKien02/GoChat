package cmd

import (
	"GoChat/internal/auth"
	"GoChat/internal/user"

	"github.com/gin-gonic/gin"
)

func SetUpRouter(
	rg *gin.RouterGroup,
	handler *Initialization,
) {
	user.UserRoutes(rg, handler.UserHandler)
	auth.AuthRoutes(rg, handler.AuthHandler)
}
