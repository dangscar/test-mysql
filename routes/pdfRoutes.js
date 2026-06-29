const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/pdfController");

router.get("/users", getUsers); 

module.exports = router;