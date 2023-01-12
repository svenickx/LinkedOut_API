const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const jobRouter = require("./job.route");
const missionRouter = require("./mission.route");
const propositionRouter = require("./proposition.route");
const skillRouter = require("./skill.route");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/job", jobRouter);
router.use("/mission", missionRouter);
router.use("/proposition", propositionRouter);
router.use("/skill", skillRouter);

module.exports = router;
