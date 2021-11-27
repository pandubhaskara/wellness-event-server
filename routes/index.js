const express = require('express')
const router = express.Router()
const user = require("./users")
const dashboard= require("./dashboard")

router.get('/', (req, res) => {
    res.status(200).send({
        status: "success",
        message: "masuk router",
    })
})

router.use("/user", user)
router.use("/event", dashboard)

module.exports = router