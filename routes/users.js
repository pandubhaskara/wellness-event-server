const express = require('express')
const multer = require('multer')
const router = express.Router()
const input = multer()
const user = require("../controllers/user")
const auth = require("../middlewares/auth");

router.get("/", auth, user.getDetail)
router.post("/register", input.any(), user.register)
router.post("/", input.any(), user.login)

module.exports = router