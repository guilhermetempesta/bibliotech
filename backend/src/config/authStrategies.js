const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const { UserRepository } = require('../repositories/UserRepository');
const { CheckPasswordService } = require('../services/CheckPasswordService');
const { InvalidCredentialsError } = require('../utils/errors');
const tokens = require('../utils/tokens'); 

passport.use(
  new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      session: false
    }, 
    async (username, password, done) => {
      try {
        const userRepository = new UserRepository;
        const checkPasswordService = new CheckPasswordService();

        const user = await userRepository.getByUsername(username)
        if (!user) { throw new InvalidCredentialsError }
        checkPasswordService.execute(password, user.password)
        
        done(null, user)
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new BearerStrategy(
    async (token, done) => {
      try {
        const payload = await tokens.access.check(token);
        done(null, { ...payload }, { token: token });
      } catch (error) {
        done(error);
      }      
    }
  )
);