const flash = require('connect-flash');

const cookieParser = require('cookie-parser');
const express_session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


var io;


function configurePassport(app, server_io) {
  io = server_io;

  app.use(express_session({
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000
    },
    store: redisStore,
    cookieParser: cookieParser,
    secret: 'small kittens',
    resave: false,
    saveUninitialized: false
  }));
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'connect.sid',
    secret: 'small kittens',
    store: redisStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use(onAuthorizeException);
}


function setLocalSrategy(app) {
    passport.use('login', new LocalStrategy({
              usernameField : 'email',
              passwordField : 'password'
    },
      (email, password, done) => {

      }
    ));

    passport.serializeUser(function(user, done) {
      done(null, user.email);
    });

    passport.deserializeUser(function(email, done) {

    });
}




function onAuthorizeSuccess(data, accept){
  accept(null, true);
}

function onAuthorizeException(err, req, res, next) {
  if (err == 'No such user record') {
    req.logout();
    next();
  } else {
    next();
  }
}

function onAuthorizeFail(data, message, error, accept){
  accept(null, false);
}
