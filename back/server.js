const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = require("./config/db.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");

const sessionRoutes = require("./routes/sessions.routes.js");
const productRoutes = require("./routes/products.routes.js");
const cartRoutes = require("./routes/carts.routes.js");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../front")));

initializePassport();
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
