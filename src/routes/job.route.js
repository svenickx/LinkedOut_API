const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");
const jobController = require("../controllers/job.controller");

router.post("/createJob", verifyToken, verifyAdmin, jobController.createJob);

module.exports = router;
