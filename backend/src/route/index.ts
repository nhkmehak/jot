const express = require('express')
const router = express.Router()
const user = require("./user")
const blogs = require("./blogs")

router.use("/user", user)
router.use("/blog", blogs)

module.exports= router;