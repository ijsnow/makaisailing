package db

import (
	"errors"
	"fmt"

	mgo "gopkg.in/mgo.v2"
)

// MongoConnection is the connection to the db itself
type MongoConnection struct {
	session *mgo.Session
	dbURL   string
	dbName  string
}

// Initialize db stuff
func (c *MongoConnection) createLocalConnection() (err error) {
	fmt.Println("Connecting to local mongo server....")
	c.session, err = mgo.Dial(c.dbURL)

	if err == nil {
		fmt.Println("Connection established to mongo server")
	} else {
		fmt.Printf("Error occured while creating mongodb connection: %s", err.Error())
	}
	return
}

// Collection is the way to get a collection from the db
func (c *MongoConnection) Collection(collectionName string) (collection *mgo.Collection, err error) {
	collection, err = nil, nil

	if c.session != nil {
		collection = c.session.DB(c.dbName).C(collectionName)
	} else {
		err = errors.New("No original session found")
	}

	return collection, err
}

// GridFSFile creates a new GridFS file and returns is
func (c *MongoConnection) GridFSFile(fileName string) (file *mgo.GridFile, err error) {
	return c.session.DB(c.dbName).GridFS("fs").Create(fileName)
}
