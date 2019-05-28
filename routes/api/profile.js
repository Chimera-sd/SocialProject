const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

let {authProfile} = require('../../middleware/authProfile')
let {User} = require('../../modules/User')

//@route  GET /:profile 
//@desc   Find user
//@access Privte

router.get('/:profileName',authProfile,(req,res)=>{
    let {profileName} = req.params
    let token = req.body.token 
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        // console.log(user.profileName,profileName,user.profileName == profileName)
        if(user.profileName == profileName){
            return res.send('the user want to show his profile')
        }else{
            return res.send('another user wants to see the profile')
        } 
    }).catch((e)=>{
        res.status(200).send('visitor')
    })
})
module.exports = router;