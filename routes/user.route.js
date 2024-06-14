const express = require("express");
const User = require("../models/user.model.js");
const router = express.Router();
const uploadUser = require("../server/uploadUser.js");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getSessionUserId,
  resetPassword,
  updateUserImage
} = require("../controllers/user.controller.js");


//router.get("/", getSessionUserId);

//router.get("/", getUsers);
router.get("/:id", getUser);

router.get("/email/:email", getUserByEmail);

router.post('/forgot-password/:email', resetPassword);

router.put('/:id', uploadUser.single('photo'), updateUserImage);

router.post("/", createUser);

router.put("/:id/:password", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
