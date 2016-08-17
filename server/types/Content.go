package types

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

// Activity is the type for the items listed in "What we do"
type Activity struct {
	ID        bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	Title     string        `json:"title"`
	Subtitle  string        `json:"subtitle"`
	Body      string        `json:"body"`
	CreatedAt time.Time     `json:"createdAt"`
}
