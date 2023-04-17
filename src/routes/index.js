const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const missionRouter = require("./mission.route");
const propositionRouter = require("./proposition.route");
const adminRouter = require("./admin.route");
const skillRouter = require("./skill.route");
const jobRouter = require("./job.route");
const companyRouter = require("./company.route");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/mission", missionRouter);
router.use("/proposition", propositionRouter);
router.use("/admin", adminRouter);
router.use("/skill", skillRouter);
router.use("/job", jobRouter);
router.use("/company", companyRouter);

module.exports = router;
