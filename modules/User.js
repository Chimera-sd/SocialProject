const mongoose = require('mongoose')
const _ =require('lodash')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


let {secret} = require('../config/DB.js')

const schema = mongoose.Schema

let UserSchema = new schema({
  // local : {
        name :{
            type : 'string',
            trim : true,
            required : true,
            minlength : 1,
            unique : true
        },
        profileName :{
            type : 'string',
            trim : true,
            required : true,
            minlength : 1,
            unique : true
        },
        email :{
            type : 'string',
            required : true ,
            minlength : 6,
            trim : true,
            validate :{
                validator:(value)=> validator.isEmail(value)
            }  ,
            unique : true
        },
        password :{
            type :'string',
            // required : true ,
            minlength : 6,
            trim : true,
        },
        avatar :{
            type : 'string' ,
            required : true,
            default : "//www.gravatar.com/avatar/9d60a59d663de6d50164d8efe76483fc?s=200&r=pg&d=mm"
        },
        tokens: [{
            access: {
              type: 'string',
              required: true
            },
            token: {
              type: 'string',
              required: true
            }
          }],
        date : {
            type : Date ,
            default : Date.now
        },
        email_verified: 'Boolean',
        googleID: {
            type: 'string',
            required: false
        },
        photo: {
            type: 'string',
            required: false,
        },
        facebookID:{
          type: 'string',
          required: false
        }

  // },
  // facebook :{
  //       name :{
  //         type : String,
  //         trim : true,
  //         required : true,
  //         minlength : 1
  //         },
  //       profileName :{
  //         type : String,
  //         trim : true,
  //         required : true,
  //         minlength : 1
  //       },
  //       email :{
  //         type : String,
  //         required : true ,
  //         minlength : 6,
  //         trim : true,
  //         validate :{
  //             validator:(value)=> validator.isEmail(value)
  //         }  
  //       },
  //       avatar :{
  //         type : String ,
  //         required : true
  //       },
  //       token : {
  //         type : String ,
  //         required : true
  //       }
  // }
})

UserSchema.methods.genrateAuthToken= function(){
  let user = this 
  let access = 'auth'
  if(user.tokens.length !== 0){
      user.tokens =[]
  }
  let token = jwt.sign({'_id' : user._id.toHexString(),access},secret).toString();
  user.tokens.splice(1,0,{access, token});
  return user.save().then(() => {
 
      return token
    })
}

UserSchema.pre('save',function(next){
  let user = this 
  if(user.isModified('password')){
      bcrypt.genSalt(10,(err,salt)=>{
          bcrypt.hash(user.password,salt,(err,hash)=>{
              if(err) throw err 
              user.password = hash 
              next()
          })
      })
  }else{
  next()
  }
})

UserSchema.statics.findByToken = function (token) {
  let User = this
  let decoded

  try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByprofileName = function(name){
  let User = this
  return User.findOne({
      name
    });
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this
  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject()
    }
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user)
        } else {
          reject()
        }
      })
    })
  })
}

UserSchema.methods.removeToken = function (token) {
  let user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}


let User =mongoose.model('User' , UserSchema)


module.exports= {
    User 
}