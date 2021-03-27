// import bcrypt and jwt module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import and init .Router() method.
const router = require("express").Router();

// import mongodb models
const User = require("../models/user");

// REQUEST METHOD: GET, POST, PUT, PATCH, DELETE, HEAD

// POST (CREATE)
router.post("/", async (req, res) => {
  // create new user with user models
  const user = new User({
    nama: req.body.nama,
    email: req.body.email,
    nohp: req.body.nohp,
    jurusan: req.body.jurusan,
    password: req.body.password,
  });
  // save user
  try {
    const newUser = await user.save();
    // if success, return statuscode 201 and display new user.
    res.status(201).json(newUser);
    // if error, catch error and return statuscode 400, with error message.
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// LOGIN AUTH
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const users = await User.findOne({ email: email });
  if (users == null) {
    return res.status(400).send("Cannot find users");
  }
  try {
    if (await bcrypt.compare(req.body.password, users.password)) {
      const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.json({ accessToken: accessToken }).send("Login Success");
    } else {
      res.send("Wrong passwords");
    }
  } catch {
    res.status(500).send();
  }
});

// GET ALL (READ)
// Getting All user
router.get("/", authenticateToken, async (req, res) => {
  try {
    // find user from database
    const users = await User.find(req.body.name);
    // display database
    res.status(200).json(users);
    // if error, catch error and display error message with json.
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get users with pagination
// localhost:3000/siswa?page=1&limit=10

// GET (READ)
router.get("/", async (req, res) => {
  try {
    // set limit number
    const limit = req.query.limit;

    // set page number
    const page = parseInt(req.query.page);

    // set start index from zero
    const startIndex = (page - 1) * limit;

    // set end index with page multiply by limit.
    const endIndex = page * limit;

    // create object
    const results = {};

    // find user
    const users = await User.find();

    // if endIndex smaller than number of student, then return object named next with number of page and limit.
    if (endIndex < users.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    // if startIndex bigger than number of student, then return object named previous with number of page and limit.
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    // object named data is equals to number of slice between startIndex and endIndex.
    results.data = users.slice(startIndex, endIndex);

    // if success return http statuscode 200 with json results.
    res.status(200).json(results);
    // if error, catch error, return http statuscode 500, and log error message.
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One User with Id
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

// PATCH (UPDATE)
router.patch("/:id", getUser, async (req, res) => {
  // if body name value not null, set request user name to body name (replace old data).
  if (req.body.nama != null) {
    res.user.nama = req.body.nama;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.nohp != null) {
    res.user.nohp = req.body.nohp;
  }
  if (req.body.jurusan != null) {
    res.user.jurusan = req.body.jurusan;
  }
  // update user from db
  try {
    const updatedUser = await res.user.save();
    // if success send http statuscode 200 with updated siswa.
    res.status(200).json(updatedUser);
    // if error catch error, and send http statuscode 400 with error message.
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", getUser, async (req, res) => {
  try {
    // delete user id from db
    await res.user.remove();
    const users = await User.find();
    // if success, send http statuscode 200 with message.
    res.status(200).json({ message: "Deleted Siswa", users });
    // if error catch error, and send http statuscode 500 with error message.
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// middleware -> promise -> request status
async function getUser(req, res, next) {
  let user;

  // try search user by id with request params
  try {
    user = await User.findById(req.params.id);
    // if user not found, response with json statuscode 404, return message.
    if (user == null) {
      return res.status(404).json({ message: `can't find data` });
    }
    // if error, catch error and response with json statuscode 500, return error message.
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // if user found, equals res.user with user.
  res.user = user;
  next();
}

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
// SwaggerUI API Docs

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - bearerAuth: []
 *   schemas:
 *     Siswa:
 *       type: object
 *       required:
 *         - nama
 *         - email
 *         - nohp
 *         - jurusan
 *       properties:
 *         id:
 *           type: id
 *           description: Id siswa
 *         nama:
 *           type: string
 *           description: Nama siswa
 *         email:
 *           type: string
 *           description: Email siswa
 *         nohp:
 *           type: number
 *           description: Nomor Hp siswa
 *         jurusan:
 *           type: string
 *           description: Jurusan siswa
 *       example:
 *         id: 604c8dce155fec06c43c4a44
 *         nama: Maxi Aditya Kusuma
 *         email: maxi@filiasofia.sch.id
 *         nohp: +62895617047135
 *         jurusan: IPA
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email siswa
 *         password:
 *           type: string
 *           description: Jurusan siswa
 *       example:
 *         email: maxi@filiasofia.sch.id
 *         password: javascript
 */

/**
 * @swagger
 * /v1/siswa:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all student lists
 *     tags: [Siswa]
 *     responses:
 *       200:
 *         description: Get all student lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Siswa'
 */

/**
 * @swagger
 * tags:
 *   name: Siswa
 */

/**
 * @swagger
 * /v1/siswa/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get student by id
 *     tags: [Siswa]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: search user by id
 *     responses:
 *       200:
 *         description:  success find user by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Siswa'
 *       401:
 *          description: Unauthorized request
 *       403:
 *          description: The user not allowed to access
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Internal server error
 *
 */

/**
 * @swagger
 * /v1/siswa?page={page}&limit={limit}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get student list with pagination
 *     tags: [Siswa]
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         required: true
 *         description: number of page
 *       - in: query
 *         name: limit
 *         type: number
 *         required: true
 *         description: limit number
 *     responses:
 *       200:
 *         description:  success find user by pagination
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Siswa'
 *       401:
 *          description: Unauthorized request
 *       403:
 *          description: The user not allowed to access
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Internal server error
 *
 */

/**
 * @swagger
 * /v1/siswa:
 *   post:
 *     summary: Create a new user
 *     tags: [Siswa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Siswa'
 *     responses:
 *       201:
 *         description: The users was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Siswa'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /v1/siswa/login:
 *   post:
 *     summary: Login auth
 *     tags: [Siswa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: users was successfully authenticate
 *       201:
 *         description: The users was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * /v1/siswa/{id}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: Update student by the id
 *    tags: [Siswa]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The users id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Siswa'
 *    responses:
 *      200:
 *        description: The users was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Siswa'
 *      404:
 *        description: The users was not found
 *      500:
 *        description: Some error happened
 */

/**
 * @swagger
 * /v1/siswa/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove student by id
 *     tags: [Siswa]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

module.exports = router;
