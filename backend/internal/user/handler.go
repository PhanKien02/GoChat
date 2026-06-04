package user

import (
	"GoChat/shared/helper"
	"net/http"
	"strconv"

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

func (h *UserHandler) GetAllUserHandler(ctx *gin.Context) {
	var query GetAllUserQuery
	if err := ctx.ShouldBindQuery(&query); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	query.SearchKeyword = ctx.Query("searchKeyword")
	query.Page, _ = strconv.Atoi(ctx.Query("page"))
	query.Limit, _ = strconv.Atoi(ctx.Query("limit"))
	users, err := h.service.GetAllUser(ctx, query)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	helper.HTTPResponse(ctx, http.StatusOK, "Users fetched successfully", users, true)
}
