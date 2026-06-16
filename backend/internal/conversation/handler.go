package conversation

import (
	"GoChat/shared/helper"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ConversationHandler struct {
	service ConversationService
}

func NewConversationHandler(service ConversationService) *ConversationHandler {
	return &ConversationHandler{service: service}
}

func (h *ConversationHandler) CreateConversation(ctx *gin.Context) {
	var conv Conversation
	if err := ctx.ShouldBindJSON(&conv); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.service.CreateConversation(ctx.Request.Context(), &conv); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	helper.HTTPResponse(ctx, http.StatusCreated, "Conversation created successfully", conv, true)
}

func (h *ConversationHandler) GetConversation(ctx *gin.Context) {
	id := ctx.Param("id")
	conv, err := h.service.GetConversationByID(ctx.Request.Context(), id)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	helper.HTTPResponse(ctx, http.StatusOK, "Conversation fetched successfully", conv, true)
}

func (h *ConversationHandler) GetAllConversations(ctx *gin.Context) {
	var query GetAllConversationQuery
	if err := ctx.ShouldBindQuery(&query); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	// Extract user ID from context (set by JWT middleware). The stored value may be a string or numeric.
	uidVal, ok := ctx.Get("userID")
	if !ok {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, "unauthorized")
		return
	}

	var userId string
	switch v := uidVal.(type) {
	case string:
		userId = v
	case float64:
		userId = strconv.FormatInt(int64(v), 10)
	case int:
		userId = strconv.Itoa(v)
	case int64:
		userId = strconv.FormatInt(v, 10)
	default:
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "invalid user id type")
		return
	}

	query.SearchKeyword = ctx.Query("searchKeyword")
	query.Page, _ = strconv.Atoi(ctx.Query("page"))
	query.Limit, _ = strconv.Atoi(ctx.Query("limit"))

	convs, err := h.service.GetAllConversations(ctx.Request.Context(), userId, query)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	helper.HTTPResponse(ctx, http.StatusOK, "Conversations fetched successfully", convs, true)
}

func (h *ConversationHandler) UpdateConversation(ctx *gin.Context) {
	id := ctx.Param("id")
	var conv Conversation
	if err := ctx.ShouldBindJSON(&conv); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.service.UpdateConversation(ctx.Request.Context(), id, &conv); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	helper.HTTPResponse[any](ctx, http.StatusOK, "Conversation updated successfully", nil, true)
}

func (h *ConversationHandler) DeleteConversation(ctx *gin.Context) {
	id := ctx.Param("id")
	if err := h.service.DeleteConversation(ctx.Request.Context(), id); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}
	helper.HTTPResponse[any](ctx, http.StatusOK, "Conversation deleted successfully", nil, true)
}
