const passport = require("passport");

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = authMiddleware;
