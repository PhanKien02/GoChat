package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"GoChat/cmd"
	appRouter "GoChat/cmd"
	"GoChat/config"
	"GoChat/shared/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	// 1. Kết nối MongoDB
	client, err := mongo.Connect(options.Client().ApplyURI(cfg.MongoURL))
	if err != nil {
		log.Fatal("Lỗi kết nối MongoDB:", err)
	}

	// Kiểm tra xem kết nối có thực sự thành công không
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal("Không thể ping tới MongoDB (DB chưa bật?):", err)
	} else {
		log.Println("Connected to MongoDB successfully!")
	}
	defer client.Disconnect(context.Background())

	// 3. Khởi tạo Gin Router
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"code":      http.StatusNotFound,
			"isSuccess": false,
			"message":   "route not found",
		})
	})
	// 4. Tạo router group và đăng ký routes
	api := router.Group("/api")
	router.GET("/ws", cmd.SocketHandler)
	api.Use(middleware.ErrorHandler())
	init := appRouter.NewInitialization(client)
	appRouter.SetUpRouter(api, init)

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.Run()
}
