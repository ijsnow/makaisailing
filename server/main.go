package main

import (
	"os"

	"github.com/codegangsta/cli"
)

func main() {
	Run(os.Args)
}

// Run creates, configures and runs
// main cli.App
func Run(args []string) {

	app := cli.NewApp()
	app.Name = "app"
	app.Usage = "React server application"

	app.Commands = []cli.Command{
		{
			Name:   "run",
			Usage:  "Runs server",
			Action: RunServer,
		},
	}
	app.Run(args)
}

// RunServer creates, configures and runs
// main server.App
func RunServer(c *cli.Context) {
	app := NewApp(AppOptions{})
	app.Run()
}
