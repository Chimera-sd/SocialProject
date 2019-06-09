const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
// const bcrypt = require('bcryptjs')
const _ = require('lodash')
const passport = require('passport')


let {User} = require('../modules/User')
let {authHome} = require('../middleware/authHome')

router.get('/',(req,res)=>{
    res.json({'msg':'user works'})
})

router.get('/login',(req,res)=>{
  res.json({'msg':'user login'})
})

//@route  Post api/register 
//@desc   Register user
//@access Puplic

router.post('/register', (req,res)=>{
    let body = _.pick(req.body, ['name','email', 'password'])

    User.findOne({email : body.email})
      .then((user)=>{
          if(user){
              return res.status(400).json({'email':`${body.email} already exsists`})
          }
          let arrEmail = body.email.split("@")
          let profileName = arrEmail[0];
          const avatar = gravatar.url(body.email , {
              s: 200,
              r : 'pg',
              d:'mm'
          }) 
          const newUser = new User({
            name : body.name,
            email :body.email,
            profileName,
            password : body.password,
            avatar  
          })
          newUser.save().then(()=>{
              return newUser.genrateAuthToken();
          }).then((token)=>res.send(newUser))
          .catch((err)=>{
            res.status(400).send(err)
          }) 
      }).catch((e)=>{
        res.status(401).send('invalid information')  
      })
})

//@route  Post api/login 
//@desc   Login user
//@access Puplic

router.post('/login', (req,res)=>{
    let body = _.pick(req.body,['email','password']);
    console.log(body)
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.genrateAuthToken().then((token)=>{
        res.status(200).json({token,user})
        })
    }).catch((e)=>{
        res.status(400).json({'msg':"invalid user or password"})
    })
    
    
    // User.findOne({email : req.body.email})
    //     .then((user)=>{
    //         if(!user){
    //             return res.status(400).json({'msg':`invaild password or e-mail`})
    //         }
    //         bcrypt.compare(req.body.password , user.password)
    //             .then(isMatch=> {
    //                 if(isMatch){
    //                 res.status(200).json(_.pick(user,['tokens[0].token','name','avatar']))
    //                 }else{
    //                 res.status(400).json({'msg':`invaild password or e-mail`})
    //                 }
    //             })
          
    //   })
})

//@route  Post api/logout 
//@desc   logiut user / Remove Token
//@access Privte

router.delete('/logout',authHome,(req,res)=>{
    req.user.removeToken(req.token).then(() => {
        res.status(200).send("logout sucess");
      }, () => {
        res.status(400).send();
      })
})


router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/user/login',failureRedirect: '/' ,session: false}))

// router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))

// router.get('/auth/google/callback', 
//     passport.authenticate('google', { successRedirect: '/profile',failureRedirect: '/' }))

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }, {
    session: false
  }))

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/user/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/')
// })
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/user/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;