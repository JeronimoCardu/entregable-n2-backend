const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.js");

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;

    if (!first_name || !last_name || !age || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists",
      });
    }

    const newUser = await UserModel.create({
      first_name,
      last_name,
      age,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      payload: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al registrar usuario",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect credentials",
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY_COOKIES,
      { expiresIn: "1h" },
    );

    return res.json({
      status: "success",
      token,
      payload: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al iniciar sesión",
    });
  }
});

router.get("/login-failed", (req, res) => {
  res.status(401).json({
    status: "error",
    message: "Login failed",
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      status: "success",
      payload: req.user,
    });
  },
);

// LOGOUT
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      res.json({
        status: "success",
        message: "Sesión cerrada exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al cerrar sesión",
      });
    }
  },
);

module.exports = router;
