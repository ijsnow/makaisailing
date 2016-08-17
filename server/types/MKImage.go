package types

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

// MKImage is the image type to be saved in the db
type MKImage struct {
	ID            bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	Caption       string        `json:"caption" bson:"caption"`
	Filename      string        `json:"filename"`
	Content       []byte        `json:"content"`
	IsForHomePage bool          `json:"isForHomePage" bson:"isForHomePage"`
	CreatedAt     time.Time     `json:"createdAt"`
}
