const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const {facebookAuth,googleAuth} = require('./auth')
const {User} = require('../modules/User')

module.exports = passport =>{
   
  // Google login 
  passport.use(new GoogleStrategy({
    clientID: googleAuth.clientID,
    clientSecret: googleAuth.clientSecret,
    callbackURL: googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
      process.nextTick(function(){
        User.findOne({'google.id': profile.id}, function(err, user){
          if(err)
            return cb(err);
          if(user)
            return cb(null, user);
          else {
            var newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = accessToken;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;

            newUser.save(function(err){
              if(err)
                throw err;
              return cb(null, newUser);
            })
          }
        })
      })
    }
  ))

  // Facebook login
  passport.use(new FacebookStrategy({
      clientID: facebookAuth.clientID,
      clientSecret: facebookAuth.clientSecret,
      callbackURL: facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function(){
        User.findOne({'facebook.id' : profile.id },function(err,user) {
          if(err)
            done(err)
          if(user)
            done(null,user)
          else{
            let newUser = new User({
              'facebook.id' : profile.id,
              'facebook.token' : accessToken,
              'facebook.name' : profile.name.givenName + ' ' + profile.name.familyName,
              'facebook.email' : profile.emails[0].value
            })

            newUser.save(function(err){
              if(err)
                throw err
              return done(null,newUser)

            })
          }
        })
      })
    }
  ))

}