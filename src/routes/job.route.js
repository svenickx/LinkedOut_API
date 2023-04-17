const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const hasToken = require("../middlewares/hasToken");
const isAdmin = require("../middlewares/isAdmin");

// Job
router.post("/createJob", hasToken, isAdmin, jobController.createJob);
router.put("/updateJob", hasToken, isAdmin, jobController.updateJob);
router.delete("/deleteJob", hasToken, isAdmin, jobController.deleteJob);
router.get("/getJobs", jobController.getJobs);

module.exports = router;
