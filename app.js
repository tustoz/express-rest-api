// import and initialize environtment lib: mongoose, express, swaggerUI.
const mongoose = require("mongoose");
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();

// initialize .env file
require("dotenv").config();

// ===== SERVER =====

// use express bodyparser
app.use(express.json());

// import routes
const usersRouter = require("./routes/users.routes");

// api routes endpoint
app.use("/v1/siswa", usersRouter);

app.use("/", (req, res) => {
  res.send("Server Running");
});

// listen port 3000
app.listen(process.env.PORT || 5000, () => console.log("Server Started"));

// ===== DATABASE =====

// connect to mongoDB, useNewUrlParser option to convert string, useUnifiedTopolgy option to remove several topology that are no longer relevant with new topology engine.
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// get error, callback with console error
db.on("error", (err) => console.error(err));

// when connection open, callback with console connected to database
// callback adalah fungsi yang di passing ke dalam fungsi lain sebagai argumen, nantinya dieksekusi oleh fungsi yang membungkus callback tersebut.
db.once("open", () => console.log("Connected to Database"));

// ===== API DOCUMENTATIONS =====

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
