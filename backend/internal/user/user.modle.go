package userModel

type UserModel struct {
	Id        string `json:"_id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Avatar    string `json:"avatar"`
	Online    bool   `json:"online"`
	Bio       string `json:"bio"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}
