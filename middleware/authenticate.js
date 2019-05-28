let {Profile} = require('../modules/Profile');

let authenticate = (req, res, next) => {
  let token = req.body.authToken

  if(!token){
      
  }
  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
