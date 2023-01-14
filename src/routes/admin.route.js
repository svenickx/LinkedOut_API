const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const verifyRegister = require("../middlewares/verifyRegister");
const verifyLogin = require("../middlewares/verifyLogin");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.delete(
  "/deleteUser",
  verifyToken,
  verifyAdmin,
  adminController.deleteUser
);

router.put("/updateUser", verifyToken, verifyAdmin, adminController.updateUser);
router.get("/getUsers", verifyToken, verifyAdmin, adminController.getUsers);

router.post(
  "/createSkill",
  verifyToken,
  verifyAdmin,
  adminController.createSkill
);
router.put(
  "/updateSkill",
  verifyToken,
  verifyAdmin,
  adminController.updateSkill
);
router.delete(
  "/deleteSkill",
  verifyToken,
  verifyAdmin,
  adminController.deleteSkill
);
router.get("/getSkills", verifyToken, verifyAdmin, adminController.getSkills);

router.post("/createJob", verifyToken, verifyAdmin, adminController.createJob);
router.put("/updateJob", verifyToken, verifyAdmin, adminController.updateJob);
router.delete(
  "/deleteJob",
  verifyToken,
  verifyAdmin,
  adminController.deleteJob
);
router.get("/getJobs", verifyToken, verifyAdmin, adminController.getJobs);

router.get(
  "/getFreelanceMissions",
  verifyToken,
  verifyAdmin,
  adminController.getFreelanceMissions
);

module.exports = router;
