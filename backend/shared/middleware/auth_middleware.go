package middleware

import (
	"GoChat/shared/helper"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			helper.ErrorResponse(c, http.StatusUnauthorized, "missing token")
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := ValidateToken(tokenString)
		if err != nil || !token.Valid {
			helper.ErrorResponse(c, http.StatusUnauthorized, "invalid token")
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		c.Set("user_id", claims["user_id"])

		c.Next()
	}
}
func ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}

		secret := os.Getenv("ACCESS_TOKEN_SECRET")
		return []byte(secret), nil
	})
}
