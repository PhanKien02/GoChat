package auth

import (
	"GoChat/shared/helper"
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
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	err = h.service.Register(ctx, &user)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	helper.HTTPResponse(ctx, http.StatusCreated, "User registered successfully", user, true)
}

func (h *AuthHandler) LoginHandler(ctx *gin.Context) {
	var user LoginRequest
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	loginRes, refreshToken, err := h.service.Login(ctx, &user)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	ctx.SetCookie("refresh_token", refreshToken, 60*60*24*7, "/", "localhost", true, true)
	helper.HTTPResponse(ctx, http.StatusOK, "User logged in successfully", loginRes, true)
}
