package auth

import (
	"GoChat/config"
	"GoChat/internal/user"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(ctx context.Context, req *RegisterUserRequest) error
	Login(ctx context.Context, req *LoginRequest) (LoginResponse, string, error)
}

type authService struct {
	userServic user.UserService
}

func NewAuthService(userService user.UserService) *authService {
	return &authService{userServic: userService}
}
func (auth *authService) Register(ctx context.Context, req *RegisterUserRequest) error {
	pass, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	userModel := &user.CreateUserRequest{
		Username: req.Username,
		Password: string(pass),
		Email:    req.Email,
	}
	return auth.userServic.CreateUser(ctx, userModel)
}

func (auth *authService) Login(ctx context.Context, req *LoginRequest) (*LoginResponse, string, error) {
	user, _ := auth.userServic.GetUserByEmail(ctx, req.Login)
	if user == nil {
		return nil, "", errors.New("user not found")
	}
	isPasswordMath := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if isPasswordMath != nil {
		return nil, "", errors.New("password not match")
	}

	accessToken, err := generateToken(user.Id.Hex(), "access")
	if err != nil {
		return nil, "", err
	}
	refreshToken, err := generateToken(user.Id.Hex(), "refresh")
	if err != nil {
		return nil, "", err
	}
	loginResp := &LoginResponse{
		AccessToken: accessToken,
		UserInfo: &UserInfo{
			Id:       user.Id.Hex(),
			Username: user.Username,
			Email:    user.Email,
			Avatar:   user.Avatar,
			Online:   user.Online,
			Bio:      user.Bio,
		},
	}
	return loginResp, refreshToken, nil
}

func parseDuration(d string) time.Duration {
	if len(d) > 1 && d[len(d)-1] == 'd' {
		// Convert e.g. "1d" to hours: "24h"
		var days int
		_, err := fmt.Sscanf(d, "%dd", &days)
		if err == nil {
			return time.Duration(days) * 24 * time.Hour
		}
	}
	val, err := time.ParseDuration(d)
	if err == nil {
		return val
	}
	return 24 * time.Hour // fallback
}

func generateToken(userID string, typeToken string) (string, error) {
	cfg, _ := config.Load()
	screctKey := []byte(cfg.AccessTokenSecret)
	durationStr := cfg.AccessTokenExpire

	if typeToken == "refresh" {
		screctKey = []byte(cfg.RefreshTokenSecret)
		durationStr = cfg.RefreshTokenExpire
	}

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(parseDuration(durationStr)).Unix(),
		"iat":     time.Now().Unix(),
	}

	// 2. Create the token object with the chosen signing method and claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 3. Sign the token using your secret key
	tokenString, err := token.SignedString(screctKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
