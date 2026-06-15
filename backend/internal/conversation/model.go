package conversation

import (
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Conversation struct {
	ID               bson.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	Name             string          `bson:"name,omitempty" json:"name,omitempty"`
	Password         string          `bson:"password,omitempty" json:"password,omitempty"` // store hashed password only
	Avatar           string          `bson:"avatar,omitempty" json:"avatar,omitempty"`
	UserIDs          []bson.ObjectID `bson:"userIds,omitempty" json:"userIds,omitempty"`
	ConversationType string          `bson:"conversationType,omitempty" json:"conversationType,omitempty"`
	CreatedAt        string          `bson:"createdAt,omitempty,required,type=timestamp" json:"createdAt"`
	UpdatedAt        string          `bson:"updatedAt,omitempty,required,type=timestamp" json:"updatedAt"`
}
