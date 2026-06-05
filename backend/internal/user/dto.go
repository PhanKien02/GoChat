package user

type CreateUserRequest struct {
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

type GetAllUserQuery struct {
	Page          int    `json:"page" binding:"omitempty" default:"1"`
	Limit         int    `json:"limit" binding:"omitempty" default:"10"`
	SearchKeyword string `json:"searchKeyword" binding:"omitempty"`
}

type GetAllUserResponse struct {
	Users     *[]UserInfo `json:"users" binding:"required"`
	Page      int         `json:"page" binding:"required"`
	Size      int         `json:"size" binding:"required"`
	TotalPage int         `json:"totalPage" binding:"required"`
	Total     int         `json:"total" binding:"required"`
}
