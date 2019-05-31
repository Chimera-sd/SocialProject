let {User} = require('../modules/User');
let _ =require('lodash')



let authPersonalProfile ={
  sendID : (req, res, next) => {
      let {profileName} = req.params

      User.findOne({profileName}).then((user)=>{

        if(!user){
          return Promise.reject()
        }
        req.id = _.pick(user,["_id"])._id
        console.log(res.locals.id)
        next()
      }).catch((err)=>{
        res.status(404).send("profile not found")
      })
  },
  checkToken : (req, res, next) => {
    
    let token = req.body.token
    User.findByToken(token)
      .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    }).catch((e) => {
      res.status(403).send("Forbidden");
    })
  }
}


module.exports = {authPersonalProfile};
