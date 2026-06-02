package main

import (
	"context"
	"log"

	appRouter "GoChat/cmd"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func main() {
	// 1. Kết nối MongoDB
	client, err := mongo.Connect(options.Client().ApplyURI("mongodb://admin:admin123@localhost:27018/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.10"))
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
	appRouter.SetUpRouter(api, client)

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.Run() // listens on 0.0.0.0:8080 by default
}
