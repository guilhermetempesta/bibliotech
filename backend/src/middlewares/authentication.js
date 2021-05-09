const { UserRepository } = require('../repositories/UserRepository');
const { UnauthorizedError, InvalidCredentialsError } = require('../utils/errors');
const passport = require('passport');
const tokens = require('../utils/tokens');

module.exports = {
  
  local (req, res, next) {
    passport.authenticate(
        'local',
        { session: false },
        (error, user, info) => {

            if (error) { return next(error) }
            if (!user) { throw new InvalidCredentialsError }
        
            req.user = user;
            return next();
      }
    )(req, res, next);
  },

  bearer (req, res, next) {
    passport.authenticate(
        'bearer',
        { session: false },
        (error, user, info) => {

            if (error) { return next(error) }
            if (!user) { throw new UnauthorizedError }

            req.token = info.token;
            req.user = user;
            return next();
      }
    )(req, res, next);
  }

}