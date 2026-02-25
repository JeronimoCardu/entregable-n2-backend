const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const sessionRoutes = require("./routes/sessions.routes.js");

const connectDB = require("./config/db.js");

const initializePassport = require("./config/passport.config.js");
const passport = require("passport");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/sessions", sessionRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
