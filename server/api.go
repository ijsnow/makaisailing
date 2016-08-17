package main

import (
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/ijsnow/makaisailing/server/auth"
	"github.com/ijsnow/makaisailing/server/types"

	gomail "gopkg.in/gomail.v2"
	"gopkg.in/labstack/echo.v1"
	"gopkg.in/mgo.v2/bson"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type API struct{}

// Bind attaches api routes
func (api *API) Bind(group *echo.Group) {
	group.Get("/v1/conf", api.ConfHandler)

	group.Get("/page/home", api.GetHomepageContent)
	group.Get("/page/gallery", api.GetGalleryContent)
	group.Get("/images", api.GetImages)
	group.Get("/images/:id", api.GetImage)
	group.Get("/activities", api.GetActivities)

	group.Post("/email", api.SendEmail)

	authGroup := group.Group("/auth")
	authGroup.Post("/create", api.CreateUser)
	authGroup.Post("/login", api.Login)

	adminGroup := group.Group("/admin")
	adminGroup.Use(requireAuth)
	adminGroup.Post("/logout", api.Logout)
	adminGroup.Post("/image", api.UploadImage)
	adminGroup.Put("/image/edit", api.UpdateImage)
	adminGroup.Post("/activity/new", api.AddActivity)
	adminGroup.Put("/activity/edit", api.UpdateActivity)
	adminGroup.Delete("/activity/:id", api.DeleteActivity)
}

func requireAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		token := c.Request().Header.Get("Authorization")

		if token == "" {
			return echo.NewHTTPError(http.StatusUnauthorized)
		}

		app := c.Get("app").(*App)
		users, err := app.Mongo.Collection("users")

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		user := types.User{}
		err = users.Find(bson.M{"token": token}).One(&user)

		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		c.Set("user", user)

		return next(c)
	}
}

// ConfHandler handle the app config, for example
func (api *API) ConfHandler(c *echo.Context) error {
	app := c.Get("app").(*App)
	c.JSON(200, app.Conf.Root)
	return nil
}

// CreateUser is the handler for creating a user
// @params
// -- username
// -- password
func (api *API) CreateUser(c *echo.Context) error {
	username := c.Form("username")
	if username == "" {
		return echo.NewHTTPError(http.StatusForbidden, "username is required")
	}

	password := c.Form("password")
	if password == "" {
		return echo.NewHTTPError(http.StatusForbidden, "password is required")
	}

	if hash, err := auth.Hash(password); err == nil {
		app := c.Get("app").(*App)
		users, err := app.Mongo.Collection("users")

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		user := types.User{}
		err = users.Find(bson.M{"username": username}).One(&user)

		// User already exists
		if err == nil {
			return echo.NewHTTPError(http.StatusBadRequest, "User already exists")
		}

		err = users.Insert(&types.User{
			Username:     username,
			PasswordHash: hash,
		})

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		token, err := auth.Jwt(username)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		err = users.Update(bson.M{"username": username}, bson.M{"$set": bson.M{"token": token}})

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		return c.JSON(http.StatusCreated, map[string]string{
			"token": token,
		})
	}

	return echo.NewHTTPError(http.StatusInternalServerError)
}

// Login the user
// @params
// -- username
// -- password
func (api *API) Login(c *echo.Context) error {
	username := c.Form("username")
	if username == "" {
		return echo.NewHTTPError(http.StatusNotFound, "username is required")
	}

	password := c.Form("password")
	if password == "" {
		return echo.NewHTTPError(http.StatusNotFound, "password is required")
	}

	app := c.Get("app").(*App)
	users, err := app.Mongo.Collection("users")

	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError)
	}

	user := types.User{}
	err = users.Find(bson.M{"username": username}).One(&user)

	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	if auth.ValidatePassword(user.PasswordHash, password) == nil {
		token, err := auth.Jwt(username)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		err = users.Update(bson.M{"username": username}, bson.M{"$set": bson.M{"token": token}})

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		return c.JSON(http.StatusAccepted, map[string]string{"token": token})
	}

	return echo.NewHTTPError(http.StatusNotFound)
}

// Logout unsets the users token
func (api *API) Logout(c *echo.Context) error {
	token := c.Request().Header.Get("Authorization")
	app := c.Get("app").(*App)
	users, err := app.Mongo.Collection("users")
	err = users.Update(bson.M{"token": token}, bson.M{"$unset": bson.M{"token": ""}})

	c.NoContent(http.StatusNoContent)

	return err
}

// UploadImage is handler for uploading an image
// @params
// -- image: the image file
func (api *API) UploadImage(c *echo.Context) error {
	// Get uploaded image
	image, fh, err := c.Request().FormFile("file")
	if err != nil {
		return err
	}
	defer image.Close()

	isForHomePage := c.Request().FormValue("isForHomePage")
	isForHomePageBool, err := strconv.ParseBool(isForHomePage)
	if err != nil {
		return err
	}

	caption := c.Request().FormValue("caption")
	if err != nil {
		return err
	}

	bytes, err := ioutil.ReadAll(image)
	if err != nil {
		return err
	}

	app := c.Get("app").(*App)
	images, err := app.Mongo.Collection("images")

	err = images.Insert(&types.MKImage{
		Filename:      fh.Filename,
		Content:       bytes,
		Caption:       caption,
		IsForHomePage: isForHomePageBool,
		CreatedAt:     bson.Now(),
	})

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusCreated)
}

// UpdateImage updates an image. Only can change caption and IsForHomePage
func (api *API) UpdateImage(c *echo.Context) error {
	id := c.Form("_id")
	if id == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "_id is required")
	}

	caption := c.Form("caption")
	if caption == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "caption is required")
	}

	isForHomePage := c.Form("isForHomePage")
	if isForHomePage == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "isForHomePage is required")
	}

	isForHomePageBool, err := strconv.ParseBool(isForHomePage)
	if err != nil {
		return err
	}

	app := c.Get("app").(*App)
	images, err := app.Mongo.Collection("images")
	if err != nil {
		return err
	}

	err = images.UpdateId(bson.ObjectIdHex(id), bson.M{
		"$set": bson.M{
			"caption":       caption,
			"isForHomePage": isForHomePageBool,
		},
	})

	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	return c.NoContent(http.StatusOK)
}

// GetImages gets all images
func (api *API) GetImages(c *echo.Context) error {
	app := c.Get("app").(*App)

	imagesCollection, err := app.Mongo.Collection("images")
	if err != nil {
		return err
	}
	var images []types.MKImage
	err = imagesCollection.Find(bson.M{}).
		Select(bson.M{"_id": 1, "caption": 1, "isForHomePage": 1}).
		All(&images)

	if err != nil {
		return err
	}

	c.JSON(http.StatusOK, images)

	return nil
}

// GetImage is handler for uploading an image
// @params
// -- id: the _id of the image
func (api *API) GetImage(c *echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	app := c.Get("app").(*App)
	images, err := app.Mongo.Collection("images")
	if err != nil {
		return err
	}

	image := types.MKImage{}
	err = images.FindId(bson.ObjectIdHex(id)).One(&image)

	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	_, err = c.Response().Write(image.Content)

	return err
}

// DeleteImage deletes an image
func (api *API) DeleteImage(c *echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "id is required")
	}

	app := c.Get("app").(*App)
	images, err := app.Mongo.Collection("images")
	if err != nil {
		return err
	}

	err = images.RemoveId(bson.ObjectIdHex(id))

	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	return c.NoContent(http.StatusOK)
}

type page struct {
	Images     []types.MKImage  `json:"images"`
	Activities []types.Activity `json:"activities"`
}

// GetHomepageContent retrieves content to be displayed on the homepage
func (api *API) GetHomepageContent(c *echo.Context) error {
	app := c.Get("app").(*App)
	activitiesCollection, err := app.Mongo.Collection("activities")
	if err != nil {
		return err
	}

	var activities []types.Activity
	err = activitiesCollection.Find(bson.M{}).All(&activities)
	if err != nil {
		return err
	}

	imagesCollection, err := app.Mongo.Collection("images")
	if err != nil {
		return err
	}
	var images []types.MKImage
	err = imagesCollection.Find(bson.M{"isForHomePage": true}).
		Select(bson.M{"_id": 1, "caption": 1, "isForHomePage": 1}).
		All(&images)

	if err != nil {
		return err
	}

	c.JSON(http.StatusOK, page{images, activities})

	return nil
}

// GetGalleryContent retrieves content to be displayed on the gallery
func (api *API) GetGalleryContent(c *echo.Context) error {
	app := c.Get("app").(*App)

	imagesCollection, err := app.Mongo.Collection("images")
	if err != nil {
		return err
	}
	var images []types.MKImage
	err = imagesCollection.Find(bson.M{}).
		Select(bson.M{"_id": 1, "caption": 1, "isForHomePage": 1}).
		All(&images)

	if err != nil {
		return err
	}

	c.JSON(http.StatusOK, page{images, nil})

	return nil
}

// GetActivities gets all activities
func (api *API) GetActivities(c *echo.Context) error {
	app := c.Get("app").(*App)
	activitiesCollection, err := app.Mongo.Collection("activities")
	if err != nil {
		return err
	}

	var activities []types.Activity
	err = activitiesCollection.Find(bson.M{}).All(&activities)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, activities)
}

// AddActivity saves a new activity
func (api *API) AddActivity(c *echo.Context) error {
	title := c.Form("title")
	if title == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "title is required")
	}

	body := c.Form("body")
	if body == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "body is required")
	}

	// optional
	subtitle := c.Form("subtitle")

	app := c.Get("app").(*App)
	activities, err := app.Mongo.Collection("activities")
	if err != nil {
		return err
	}

	err = activities.Insert(&types.Activity{
		Title:     title,
		Subtitle:  subtitle,
		Body:      body,
		CreatedAt: bson.Now(),
	})

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusCreated)
}

// UpdateActivity updates an activity
func (api *API) UpdateActivity(c *echo.Context) error {
	id := c.Form("_id")
	if id == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "_id is required")
	}

	title := c.Form("title")
	if title == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "title is required")
	}

	subtitle := c.Form("subtitle")
	if title == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "subtitle is required")
	}

	body := c.Form("body")
	if body == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "body is required")
	}

	app := c.Get("app").(*App)
	activities, err := app.Mongo.Collection("activities")
	if err != nil {
		return err
	}

	err = activities.UpdateId(bson.ObjectIdHex(id), bson.M{
		"_id":      bson.ObjectIdHex(id),
		"title":    title,
		"subtitle": subtitle,
		"body":     body,
	})

	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	return c.NoContent(http.StatusOK)
}

// DeleteActivity deletes an activity
func (api *API) DeleteActivity(c *echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "id is required")
	}

	app := c.Get("app").(*App)
	activities, err := app.Mongo.Collection("activities")
	if err != nil {
		return err
	}

	err = activities.RemoveId(bson.ObjectIdHex(id))

	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	return c.NoContent(http.StatusOK)
}

// SendEmail sends an email with gmail
func (api *API) SendEmail(c *echo.Context) error {
	fromEmail := c.Form("email")
	if fromEmail == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "email is required")
	}

	subject := c.Form("subject")
	if subject == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "subject is required")
	}

	message := c.Form("message")
	if message == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "message is required")
	}

	app := c.Get("app").(*App)
	dialer := app.Emailer.Dialer

	m := gomail.NewMessage()
	m.SetHeader("From", app.Emailer.User)
	m.SetHeader("To", "isaacjsnow@gmail.com")
	m.SetHeader("Subject", "[Contact Form] - "+subject)
	m.SetBody("text/plain", "\nFrom: "+fromEmail+"\nSubject: "+subject+"\nMessage:\n"+message)

	if err := dialer.DialAndSend(m); err != nil {
		return err
	}

	return c.NoContent(http.StatusAccepted)
}
