package user

import (
	"GoChat/config"
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	CreateUser(ctx context.Context, user *CreateUserRequest) error
	GetUserByID(ctx context.Context, id string) (*UserModel, error)
	GetUserByEmail(ctx context.Context, email string) (*UserModel, error)
	UpdateUser(ctx context.Context, id string, user *UserModel) error
	DeleteUser(ctx context.Context, id string) error
	Login(ctx context.Context, req *LoginRequest) (*LoginResponse, string, error)
}

type userService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) CreateUser(ctx context.Context, req *CreateUserRequest) error {
	userExist := s.repo.GetUserByEmail(ctx, req.Email)
	if userExist != nil {
		return errors.New("user already exists")
	}

	pass, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	userModel := &UserModel{
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(pass),
		CreatedAt: time.Now().Format(time.RFC3339),
		UpdatedAt: time.Now().Format(time.RFC3339),
	}

	return s.repo.CreateUser(ctx, userModel)
}

func (s *userService) Login(ctx context.Context, req *LoginRequest) (*LoginResponse, string, error) {
	user := s.repo.GetUserByEmail(ctx, req.Login)
	if user == nil {
		return nil, "", errors.New("user not found")
	}
	isPasswordMath := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if isPasswordMath != nil {
		return nil, "", errors.New("password not match")
	}

	accessToken, err := GenerateToken(user.Id.Hex(), "access")
	if err != nil {
		return nil, "", err
	}
	refreshToken, err := GenerateToken(user.Id.Hex(), "refresh")
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

func (s *userService) GetUserByID(ctx context.Context, id string) (*UserModel, error) {
	userId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("id Không hợp lệ")
	}
	user := s.repo.GetUserByID(ctx, userId)

	if user == nil {
		return nil, errors.New("Không tìm thấy user")
	}
	return user, nil
}
func (s *userService) GetUserByEmail(ctx context.Context, email string) (*UserModel, error) {
	return s.repo.GetUserByEmail(ctx, email), nil
}
func (s *userService) UpdateUser(ctx context.Context, id string, user *UserModel) error {
	userId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("id Không hợp lệ")
	}
	return s.repo.UpdateUser(ctx, userId, user)
}
func (s *userService) DeleteUser(ctx context.Context, id string) error {
	userId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("id Không hợp lệ")
	}
	return s.repo.DeleteUser(ctx, userId)
}

func GenerateToken(userID string, typeToken string) (string, error) {
	cfg, _ := config.Load()
	screctKey := []byte(cfg.AccessTokenSecret)
	if typeToken == "refresh" {
		screctKey = []byte(cfg.RefreshTokenSecret)
	}
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     cfg.AccessTokenExpire,
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(screctKey))
}
