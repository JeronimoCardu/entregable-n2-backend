const express = require("express");
const router = express.Router();
const passport = require("passport");
const authorization = require("../middlewares/authorization.js");
const cartsController = require("../controllers/carts.controller.js");

const auth = passport.authenticate("jwt", { session: false });

// User only
router.post("/", auth, authorization("user"), cartsController.create);
router.get("/:cid", auth, cartsController.getById);
router.post(
  "/:cid/product/:pid",
  auth,
  authorization("user"),
  cartsController.addProduct,
);
router.delete(
  "/:cid/product/:pid",
  auth,
  authorization("user"),
  cartsController.removeProduct,
);
router.put(
  "/:cid/product/:pid",
  auth,
  authorization("user"),
  cartsController.updateProductQuantity,
);
router.post(
  "/:cid/purchase",
  auth,
  authorization("user"),
  cartsController.purchase,
);

module.exports = router;
