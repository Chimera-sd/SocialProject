let {User} = require('../modules/User');

let authenticate = (req, res, next) => {
  
  let token = req.body.token

  console.log(token)

  User.findByToken(token).then((user) => {
    
    console.log(user)
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

module.exports = {authenticate};
