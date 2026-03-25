const express = require("express");
const router = express.Router();
const passport = require("passport");
const authorization = require("../middlewares/authorization.js");
const productsController = require("../controllers/products.controller.js");

const auth = passport.authenticate("jwt", { session: false });

// Public
router.get("/", productsController.getAll);
router.get("/:pid", productsController.getById);

// Admin only
router.post("/", auth, authorization("admin"), productsController.create);
router.put("/:pid", auth, authorization("admin"), productsController.update);
router.delete("/:pid", auth, authorization("admin"), productsController.delete);

module.exports = router;
