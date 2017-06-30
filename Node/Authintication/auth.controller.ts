import * as flash from "connect-flash"
import * as passport from "passport"
import * as psLocal from "passport-local"
import * as exSession from "express-session"
import * as cookieParser from "cookie-parser"


import User from '../Models/user.model'


export default class Auth {

  constructor(app) {
    this.configure(app);
    this.localStrategy();
  }

  private configure(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(Auth.safeHandle);
  }


  private localStrategy() {
    passport.use('local', new psLocal.Strategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      (email, password, done) => {

        User.LoadByEmail(email)
          .then(user => {

            if (!user) return done("Such user record is empty", false)

            if (!user.isVerified()) return done("User is not veryfied", false);

            if (!user.isPassword(password)) return done("Invalid email or password", false)

            return done(null, user);

          })
          .catch(err => done("Invalid email or password", false));

      }
    ));

    passport.serializeUser((user, done) => done(null, user.Data.email));

    passport.deserializeUser((email, done) => User.LoadByEmail(email).then(user => done(null, user)).catch(err => done("Error", null)));
  }


  private static safeHandle(err, req, res, next) {
    if (err == 'No such user record') {
      req.logout();
      next();
    } else {
      next();
    }
  }
}