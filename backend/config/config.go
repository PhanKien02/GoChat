package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	AccessTokenSecret  string
	AccessTokenExpire  string
	RefreshTokenSecret string
	RefreshTokenExpire string
	MongoURL           string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	return &Config{
		Port:               os.Getenv("PORT"),
		AccessTokenSecret:  os.Getenv("ACCESS_TOKEN_SECRET"),
		AccessTokenExpire:  os.Getenv("ACCESS_TOKEN_EXPIRE"),
		RefreshTokenSecret: os.Getenv("REFRESH_TOKEN_SECRET"),
		RefreshTokenExpire: os.Getenv("REFRESH_TOKEN_EXPIRE"),
		MongoURL:           os.Getenv("MONGO_URI"),
	}, nil
}
