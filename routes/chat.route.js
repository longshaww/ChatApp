const express = require("express");
const { getChat } = require("../controllers/chat.controller");
const router = express.Router();

router.get("/", getChat);

module.exports = router;
