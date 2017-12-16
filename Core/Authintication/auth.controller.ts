import * as flash from "connect-flash"
import * as express_session from 'express-session'
import * as passport from "passport"
import * as cookieParser from "cookie-parser"

import * as psLocal from "passport-local"
import * as psGoogle from 'passport-google-oauth20'
import * as psFacebook from 'passport-facebook'

import * as keys from '../keys'

import User from '../Models/user.model'
import RealtimeApi from '../Controllers/realtime.controller'
import Redis from '../Database/database.redis'


export default class Auth {

  constructor(app) {
    this.configure(app);
    this.localStrategy();
    this.googleStrategy();
    this.facebookStrategy();
  }

  private configure(app) {
    app.use(express_session({
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
      },            
      store : Redis.Instance._session ,
      cookieParser: cookieParser,
      secret: 'small kittens',
      resave: false,
      saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(Auth.safeHandle)

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

            if (!user.isPassword(password)) return done("Invalid email or password", false)

            if (!user.isVerified()) return done("User is not verified", false);
           
            return done(null, user);

          })
          .catch(err => done("Invalid email or password", false));

      }
    ));

    passport.serializeUser((user, done) =>  done(null, user.Data.email));

    passport.deserializeUser((email, done) => 
    {             
       User.LoadByEmail(email).then(user => done(null, user)).catch(err => done("No such user record", null)) 
    });
  }

  private googleStrategy(){
    passport.use('google',new psGoogle.Strategy({

        clientID: keys.GOOGLE_AUTH_CLIENTID,
        clientSecret: keys.GOOGLE_AUTH_SECRET,
        callbackURL: `${keys.HOST_URL}${keys.GOOGLE_AUTH_CALLBACK}`
        
     },(accessToken, refreshToken, profile, cb) => 
        User.SocialFindCreate(profile.id, 'google', profile)
            .then( anw => anw.success ? cb(null,anw.result) : cb(anw.error,null))     
    ));
  }

  private facebookStrategy(){
    passport.use('facebook',new psFacebook.Strategy({

        clientID: keys.FACEBOOK_APP_ID,
        clientSecret: keys.FACEBOOK_APP_SECRET,
        callbackURL: `${keys.HOST_URL}${keys.FACEBOOK_AUTH_CALLBACK}`,
        profileFields : ['id', 'displayName', 'email', 'picture.type(large)']

     },(accessToken, refreshToken, profile, cb) => 
        User.SocialFindCreate(profile.id, 'facebook', profile)
            .then( anw => anw.success ? cb(null,anw.result) : cb(anw.error,null))     
    ));
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