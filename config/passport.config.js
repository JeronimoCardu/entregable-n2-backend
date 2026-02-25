const passport = require("passport");
const passportJwt = require("passport-jwt");
const UserModel = require("../models/User.js");

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies.auth_token;
  }
  return null;
};

const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          ExtractJwt.fromAuthHeaderAsBearerToken(),
          cookieExtractor,
        ]),
        secretOrKey: process.env.SECRET_KEY_COOKIES,
      },
      async (jwtPayload, done) => {
        try {
          const user = await UserModel.findById(jwtPayload.id).select(
            "-password",
          );

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};

module.exports = initializePassport;
