// import and initialize environtment lib: express.
const express = require('express')

// import and init .Router() method.
const router = express.Router()

//import mongodb models
const User = require('../models/user')

// REQUEST METHOD: GET, POST, PUT, PATCH, DELETE, HEAD

// POST (CREATE)
router.post('/', async (req, res) => {
  // create new user with user models
  const user = new User({
    nama: req.body.nama,
    email: req.body.email,
    nohp: req.body.nohp,
    jurusan: req.body.jurusan
  })
  // save user
  try {
    const newUser = await user.save()
    // if success return statuscode 201 and display new user.
    res.status(201).json(newUser)
    // if error, catch error and return statuscode 400, with error message.
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})


// GET ALL (READ)
// Getting All Siswa
router.get('/', async (req, res) => {
  try {
    // find user from database
    const users = await User.find()
    // display database
    res.status(200).json(users)
    // if error, catch error and display error message with json.
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// get users with pagination
// localhost:3000/siswa?page=1&limit=10

// GET (READ)
router.get('/', async (req, res) => {
  try {
    // set limit number
    const limit = req.query.limit;

    // set page number
    const page = parseInt(req.query.page);

    // set start index from zero
    const startIndex = (page - 1) * limit

    // set end index with page multiply by limit.
    const endIndex = page * limit

    // create object
    const results = {}

    // find user
    const users = await User.find()

    // if endIndex smaller than number of student, then return object named next with number of page and limit.
    if (endIndex < users.length) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }

    // if startIndex bigger than number of student, then return object named previous with number of page and limit.
    if (startIndex > 0){
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    // object named data is equals to number of slice between startIndex and endIndex.
    results.data = users.slice(startIndex, endIndex)

    // if success return http statuscode 200 with json results.
    res.status(200).json(results)
    // if error, catch error, return http statuscode 500, and log error message.
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One User with Id
router.get('/:id', getUser, (req, res) => {
  res.json(res.user)
})

// PATCH (UPDATE)
router.patch('/:id', getUser, async (req, res) => {
  // if body name value not null, set request user name to body name (replace old data).
  if (req.body.nama != null) {
    res.user.nama = req.body.nama
  }
  if (req.body.email != null) {
    res.user.email = req.body.email
  }
  if (req.body.nohp != null) {
    res.user.nohp = req.body.nohp
  }
  if (req.body.jurusan != null) {
    res.user.jurusan = req.body.jurusan
  }
  // update user from db
  try {
    const updatedUser = await res.user.save()
    // if success send http statuscode 200 with updated siswa.
    res.status(200).json(updatedUser)
    // if error catch error, and send http statuscode 400 with error message.
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE
router.delete('/:id', getUser, async (req, res) => {
  try {
    // delete user id from db
    await res.user.remove()
    const users = await User.find()
    // if success, send http statuscode 200 with message.
    res.status(200).json({ message: 'Deleted Siswa', users})
    // if error catch error, and send http statuscode 500 with error message.
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// middleware -> promise -> request status
async function getUser(req, res, next) {
  let user

  // try search user by id with request params
  try {
    user = await User.findById(req.params.id)
    // if user not found, response with json statuscode 404, return message.
    if (user == null) {
      return res.status(404).json({ message: `can't find data` })
    }
    // if error, catch error and response with json statuscode 500, return error message.
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  // if user found, equals res.user with user.
  res.user = user
  next()
}

module.exports = router