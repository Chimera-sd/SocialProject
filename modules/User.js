const mongoose = require('mongoose')
const _ =require('lodash')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

let {secret} = require('../config/obj.js')

const schema = mongoose.Schema

let UserSchema = new schema({
    name :{
        type : String,
        trim : true,
        required : true,
        minlength : 1
    },
    email :{
        type : String,
        required : true ,
        minlength : 6,
        trim : true,
        validate :{
            validator:(value)=> validator.isEmail(value)
        }  
    },
    password :{
        type : String,
        required : true ,
        minlength : 6,
        trim : true,
    },
    avatar :{
        type : String ,
        required : true
    },
    tokens: [{
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }],
    date : {
        type : Date ,
        default : Date.now
    }
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
        return token;
      });
}

UserSchema.pre('save',function(next){
    let user = this ;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                if(err) throw err ;
                user.password = hash ;
                next();
            })
        })
    }else{
    next();
    }
})

UserSchema.statics.findByToken = function(token){
    let user =this;
    let decoded ;
    try{
        decoded = jwt.verify(token,secret);
    }catch(e){
        return Promise.reject();
    }
    return User.findOne({
        '_id' : decoded._id,
        access : 'auth',
        'tokens.token' : token
    })
}






let User =mongoose.model('User' , UserSchema)
module.exports= {
    User 
}