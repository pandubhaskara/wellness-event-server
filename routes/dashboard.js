const express = require('express')
const multer = require('multer')
const router = express.Router()
const input = multer()
const event = require("../controllers/event")
const auth = require("../middlewares/auth");
var bodyParser = require('body-parser')
const events = require('../models/events')
var jsonParser = bodyParser.json()

router.get("/", auth, event.dashboard)
router.put("/status",auth, jsonParser,event.approveEvent)
router.post("/req", auth, jsonParser, event.proposeEvent)

module.exports = router