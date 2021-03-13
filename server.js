// import and initialize environtment lib: mongoose, express, swaggerUI.
const mongoose = require('mongoose')
const express = require('express')
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express()

// initialize .env file
require('dotenv').config()

// use routes endpoint
app.use(express.json())

// listen port 3000, if connected console log server start
app.listen(3000, () => console.log('Server Started'))

// connect to mongoDB, useNewUrlParser option to convert string, useUnifiedTopolgy option to remove several topology that are no longer relevant with new topology engine.
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// define mongoose connection with db var
const db = mongoose.connection

// get error, callback with console error
db.on('error', (err) => console.error(err))

// when connection open, callback with console connected to database
// callback adalah fungsi yang di passing ke dalam fungsi lain sebagai argumen, nantinya dieksekusi oleh fungsi yang membungkus callback tersebut.
db.once('open', () => console.log('Connected to Database'))

// import routes from path
const usersRouter = require('./routes/users.routes')

// api routes endpoint
app.use('/v1/siswa', usersRouter)

// swaggerUI Options
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Siswa REST API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

// create docs base on options
const specs = swaggerJsDoc(options);

// use this endpoint to serve swagger UI
app.use("/v1/api-docs", swaggerUI.serve, swaggerUI.setup(specs));