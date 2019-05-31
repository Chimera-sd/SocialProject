const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const _ = require('lodash')

let {authProfile} = require('../../middleware/authProfile')
let {User} = require('../../modules/User')
let {Profile} = require('../../modules/Profile');
let {authPersonalProfile} = require('../../middleware/authPersonalProfile')

//@route  GET /:profile 
//@desc   Find user
//@access Privte/public

router.get('/:profileName',
    [authProfile.sendID,authProfile.checkToken],
    (req,res)=>{

        let id = req.id
        let profileUser 
        console.log(id)
        Profile.findOne({user : id })
            .populate('User',['name','avatar'])
            .then((user)=>{
                console.log(user)
                if(!user){
                    return Promise.reject()
                }
                profileUser = user
                user.edit =true;
                res.json(user)
            }).catch((e)=>{
                res.status(200).json(profileUser)
            })
    // User.findByToken(token).then((user)=>{
    //     if(!user){
    //         return Promise.reject()
    //     }
    //     if(user.profileName == profileName){
    //         return res.json(user)
    //     }else{
    //         return res.json(_.pick(user,['name','avatar']))
    // //     } 
    // }).catch((e)=>{
    //     res.status(200).send('visitor')
    // })
})

//@route  POST /:profile 
//@desc   ChangeProfileSttings
//@access Privte

router.post('/:profileName',
    [authPersonalProfile.sendID,authPersonalProfile.checkToken],
        (req,res)=>{
        console.log("start")
        console.log(req.id)
        let newProfileData = new Profile({
            user : req.id,
            handle : req.body.handle ,
            status : req.body.status,
            company : req.body.company,
            location : req.body.location,
            website : req.body.website,
            phoneNumber : req.body.phoneNumber,
            education : req.body.education ,
            social : req.body.education 
        });
            
        newProfileData.save().then((data)=>{
            res.send(data);
        }).catch((err)=>{
            res.send(err)
        })
})



module.exports = router;