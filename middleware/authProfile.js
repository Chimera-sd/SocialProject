let {User} = require('../modules/User');

let authProfile = (req, res, next) => {
  
  let token = req.body.token

  User.findByToken(token).then((user) => {
    

    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(200).send("visitor");
  });
};

module.exports = {authProfile};
