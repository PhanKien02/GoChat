package middleware

import (
	"GoChat/config"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// In a real application, load this from a secure environment variable

// AuthMiddleware validates the JWT token
func JWTMiddleware() gin.HandlerFunc {
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}
	var jwtSecret = []byte(cfg.AccessTokenSecret)
	return func(c *gin.Context) {
		// 1. Get the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		// 2. Check if it's a Bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// 3. Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})
		// 4. Handle parsing errors or invalid tokens
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Toeken Invalid or expired token"})
			c.Abort()
			return
		}

		// 5. (Optional) Extract claims and set them in the context for later use
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			fmt.Println("claims: ", claims)
			c.Set("userID", claims["sub"]) // Assuming 'sub' holds the user ID
			c.Set("userRole", claims["role"])
		}

		// 6. Continue to the next handler
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
