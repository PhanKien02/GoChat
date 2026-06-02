package user

import "go.mongodb.org/mongo-driver/v2/bson"

type UserModel struct {
	Id        bson.ObjectID `bson:"_id,omitempty,required,type=objectid" json:"id,omitempty"`
	Username  string        `bson:"username,omitempty,required" json:"username,omitempty"`
	Email     string        `bson:"email,omitempty,required" json:"email,omitempty"`
	Password  string        `bson:"password,omitempty,required" json:"password,omitempty"`
	Avatar    string        `bson:"avatar,omitempty" json:"avatar,omitempty"`
	Online    bool          `bson:"online,omitempty" json:"online,omitempty"`
	Bio       string        `bson:"bio,omitempty" json:"bio,omitempty"`
	CreatedAt string        `bson:"createdAt,omitempty,required,type=timestamp" json:"createdAt"`
	UpdatedAt string        `bson:"updatedAt,omitempty,required,type=timestamp" json:"updatedAt"`
}
