let {User} = require('../modules/User');

let authHome = (req, res, next) => {
  
  let token = req.body.token


  User.findByToken(token).then((user) => {
    
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(200).render('index',{message:'this is a vistor'});
  });
};

module.exports = {authHome};
