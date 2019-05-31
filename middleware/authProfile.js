let {User} = require('../modules/User');
let _ = require('lodash')



let authProfile ={ 
  checkToken : (req, res, next) => {
  
      let token = req.body.token
      // let {profileName} = req.params
  
      User.findByToken(token)
        .then((user) => {
        if (!user) {
          return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
      }).catch((e) => {
        next()
      })
},
  sendID:(req, res, next) => {

    let {profileName} = req.params

    User.findOne({profileName}).then((user)=>{
      if(!user){
        return Promise.reject()
      }
      req.id = _.pick(user,["_id"])._id
    }).catch((e)=>{
      res.status(404).json({"msg":"profile not found"})
    })
  }
}

module.exports = {authProfile};


