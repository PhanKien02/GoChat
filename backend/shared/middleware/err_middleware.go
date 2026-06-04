package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AppError struct {
	Message   string `json:"message"`
	Code      int    `json:"code"`
	IsSuccess bool   `json:"isSuccess"`
}

func (e *AppError) Error() string {
	return e.Message
}

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		err := c.Errors.Last().Err
		code := http.StatusInternalServerError
		message := "internal server error"

		if appErr, ok := err.(*AppError); ok {
			code = appErr.Code
			message = appErr.Message
		}

		// Log lỗi chuẩn cấu trúc
		log.Printf("[API_ERROR] Method: %s | Path: %s | IP: %s | Status: %d | Msg: %s",
			c.Request.Method,
			c.Request.URL.Path,
			c.ClientIP(),
			code,
			err.Error(),
		)

		c.JSON(code, gin.H{
			"code":      code,
			"isSuccess": false,
			"message":   message,
		})
	}
}
