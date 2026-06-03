package user

import (
	"GoChat/shared/helper"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service UserService
}

func NewUserHandler(service UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) GetUserHandler(ctx *gin.Context) {
	id := ctx.Param("id")
	user, err := h.service.GetUserByID(ctx, id)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	helper.HTTPResponse(ctx, http.StatusOK, "User fetched successfully", user, true)
}
