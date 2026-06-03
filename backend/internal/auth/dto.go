package auth

type RegisterUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

type LoginRequest struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UserInfo struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar"`
	Online   bool   `json:"online"`
	Bio      string `json:"bio"`
}

type LoginResponse struct {
	AccessToken string `json:"access_token" binding:"required"`
	UserInfo    *UserInfo
}
