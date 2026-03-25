const passport = require("passport");
const passportJwt = require("passport-jwt");
const UserDAO = require("../daos/mongo/user.dao.js");
const UserDTO = require("../dtos/user.dto.js");

const userDAO = new UserDAO();

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
          const user = await userDAO.findById(jwtPayload.id);

          if (!user) {
            return done(null, false);
          }

          return done(null, new UserDTO(user));
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};

module.exports = initializePassport;
