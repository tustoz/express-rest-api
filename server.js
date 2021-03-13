// import and initialize environtment lib: mongoose and express.
const mongoose = require('mongoose')
const express = require('express')
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
app.use('/siswa', usersRouter)