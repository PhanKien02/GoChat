package main

import (
	"context"
	"log"

	appRouter "GoChat/cmd"
	"GoChat/config"

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

	// 4. Tạo router group và đăng ký routes
	api := router.Group("/api")
	init := appRouter.NewInitialization(client)
	appRouter.SetUpRouter(api, init)

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.Run() // listens on 0.0.0.0:8080 by default
}
