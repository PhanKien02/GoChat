package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *authService
}

func NewAuthHandler(service *authService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) RegisterHandler(ctx *gin.Context) {
	var user RegisterUserRequest
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = h.service.Register(ctx, &user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, user)
}

func (h *AuthHandler) LoginHandler(ctx *gin.Context) {
	var user LoginRequest
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	loginRes, refreshToken, err := h.service.Login(ctx, &user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.SetCookie("refresh_token", refreshToken, 60*60*24*7, "/", "localhost", true, true)
	ctx.JSON(http.StatusOK, loginRes)
}
