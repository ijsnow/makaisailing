package types

import "gopkg.in/mgo.v2/bson"

const (
	// Paragraph is a paragrapth content type
	Paragraph = iota
	// Image is a image content type
	Image = iota
	// Bullet is a bullet content type
	Bullet = iota
)

// Content is what makes up the pages
type Content struct {
	ID   bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	kind int
}

// Page is the page itself.
type Page struct {
	ID      bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	Content []Content
}
