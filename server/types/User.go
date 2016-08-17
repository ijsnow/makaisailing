package types

import "gopkg.in/mgo.v2/bson"

// User is the admin user type.
type User struct {
	ID           bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	Username     string        `json:"username"`
	PasswordHash string        `json:"passwordHash"`
}
