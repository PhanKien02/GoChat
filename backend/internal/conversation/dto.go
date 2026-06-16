package conversation

type GetAllConversationQuery struct {
	Page          int    `json:"page" binding:"omitempty" default:"1"`
	Limit         int    `json:"limit" binding:"omitempty" default:"10"`
	SearchKeyword string `json:"searchKeyword" binding:"omitempty"`
}

type GetAllConversationResponse struct {
	Conversations *[]Conversation `json:"conversations" binding:"required"`
	Page          int             `json:"page" binding:"required"`
	Size          int             `json:"size" binding:"required"`
	TotalPage     int             `json:"totalPage" binding:"required"`
	Total         int             `json:"total" binding:"required"`
}

type ConversationRequest struct {
	Name             string   `json:"name" binding:"optional"`
	UserIDs          []string `json:"userIDs" binding:"required"`
	ConversationType string   `json:"conversationType" binding:"required"`
}
