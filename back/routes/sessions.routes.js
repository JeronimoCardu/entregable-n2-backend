const express = require("express");
const router = express.Router();
const passport = require("passport");
const sessionsController = require("../controllers/sessions.controller.js");

router.post("/register", sessionsController.register);
router.post("/login", sessionsController.login);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  sessionsController.current,
);

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  sessionsController.logout,
);

router.post("/forgot-password", sessionsController.forgotPassword);
router.post("/reset-password", sessionsController.resetPassword);

module.exports = router;
