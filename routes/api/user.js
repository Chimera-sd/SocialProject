const express = require('express')
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const _ = require('lodash')

let {User} = require('../../modules/User');

router.get('/',(req,res)=>{
    res.json({'msg':'user works'})
})

//@route  Post api/register 
//@desc   Register user
//@access Puplic

router.post('/register', (req,res)=>{
    
    User.findOne({email : req.body.email})
      .then((user)=>{
          if(user){
              return res.status(400).json({'email':`${req.body.email} already exsists`})
          }
          let arrEmail = req.body.email.split("@");
          let profileName = arrEmail[0];
          const avatar = gravatar.url(req.body.email , {
              s: 200,
              r : 'pg',
              d:'mm'
          }) 
          const newUser = new User({
            name :req.body.name,
            email : req.body.email,
            profileName,
            password : req.body.password,
            avatar  
          })
          newUser.save().then(()=>{
              return newUser.genrateAuthToken();
          }).then((token)=>res.send(newUser))
          .catch((err)=>{
              console.log(err);
          }) 
      })
})

//@route  Post api/login 
//@desc   Login user
//@access Puplic

router.post('/login', (req,res)=>{
    
    User.findOne({email : req.body.email})
      .then((user)=>{
          if(!user){
              return res.status(400).json({'msg':`invaild password or e-mail`})
          }
          bcrypt.compare(req.body.password , user.password)
             .then(isMatch=> {
                 if(isMatch){
                    res.status(200).json(_.pick(user,['tokens[0].token','name','avatar']))
                 }else{
                    res.status(400).json({'msg':`invaild password or e-mail`})
                 }
             })
          
      })
})

module.exports = router;