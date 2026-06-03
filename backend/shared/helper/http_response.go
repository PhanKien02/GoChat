package helper

import "github.com/gin-gonic/gin"

type Response[T any] struct {
	Message   string `json:"message"`
	Code      int    `json:"code"`
	Data      T      `json:"data"`
	IsSuccess bool   `json:"isSuccess"`
}

func HTTPResponse[T any](ctx *gin.Context, status int, message string, data T, isSuccess bool) {
	req := Response[T]{
		Code:      status,
		Message:   message,
		Data:      data,
		IsSuccess: isSuccess,
	}

	ctx.JSON(status, req)
}

func ErrorResponse(ctx *gin.Context, status int, message string) {
	req := Response[any]{
		Code:      status,
		Message:   message,
		Data:      nil,
		IsSuccess: false,
	}

	ctx.JSON(status, req)
}
