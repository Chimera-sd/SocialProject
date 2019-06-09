const JwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const {facebookAuth,googleAuth} = require('./auth')
const {User} = require('../modules/User')
const {secret} = require('./DB')

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secret


module.exports = passport =>{
   
  // Google login 
  passport.use(new GoogleStrategy({
    clientID: googleAuth.clientID,
    clientSecret: googleAuth.clientSecret,
    callbackURL: googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function(){
        User.findOne({'googleID': profile.id}, function(err, user){
          if(err)
            return done(err);
          if(user)
            return done(null, user);
          else {
            console.log(profile)
            let arrEmail = profile.emails[0].value.split("@")
            let profileName = arrEmail[0];
            new User({
              name: profile.displayName,
              profileName ,
              email: profile.emails[0].value,
              email_verified: profile.emails[0].verified,
              googleID: profile.id,
              photo: profile._json.picture
          }).save().then((newUser) => {
              done(null, newUser);
          }).catch((e)=>{
            done(e)
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
        User.findOne({'facebookID' : profile.id },function(err,user) {
          if(err)
            done(err)
          if(user)
            done(null,user)
          else{
            let email
            let arrName = profile.displayName.split(" ")
            profileName = arrName[0]+arrName[1]
            if(!profile.emails){
              email = profileName+'@facebook.com'
            }else{
              email = profile.emails[0].value
            }
            console.log(profile)
            let newUser = new User({
              facebookID : profile.id,
              token : accessToken,
              name : profile.displayName,
              profileName,
              email 
            })

            newUser.save(function(err){
              if(err)
                throw err
              return done(null,newUser)

            })
          }
        }).catch((e)=> done(e))
      })
    }
  ))

}