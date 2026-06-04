package cmd

import (
	"GoChat/shared/helper"
	"GoChat/shared/middleware"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func SocketHandler(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	tokenString := ""

	if authHeader != "" {
		tokenString = strings.TrimPrefix(authHeader, "Bearer ")
	} else if cookieVal, err := c.Cookie("accessToken"); err == nil && cookieVal != "" {
		tokenString = cookieVal
	} else {
		tokenString = c.Query("token")
	}

	// Clean double quotes if token was JSON stringified in cookies
	if strings.HasPrefix(tokenString, "\"") && strings.HasSuffix(tokenString, "\"") {
		tokenString = strings.Trim(tokenString, "\"")
	}

	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "token required",
		})
		return
	}

	token, err := middleware.ValidateToken(tokenString)
	if err != nil || !token.Valid {
		helper.ErrorResponse(c, http.StatusUnauthorized, "invalid token")
		c.Abort()
		return
	}

	claims := token.Claims.(jwt.MapClaims)

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	defer conn.Close()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}

		response := gin.H{
			"userId":  claims["user_id"],
			"message": string(msg),
		}

		conn.WriteJSON(response)
	}
}
