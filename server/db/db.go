package db

import mgo "gopkg.in/mgo.v2"

// NewMongoConnection is the way to create a new MongoConnection
func NewMongoConnection(dbURL string, dbName string) MongoConnection {
	session, err := mgo.Dial(dbURL)
	if err != nil {
		panic(err)
	}

	mc := MongoConnection{session, dbURL, dbName}

	mc.createLocalConnection()

	return mc
}
