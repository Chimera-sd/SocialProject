let {User} = require('../modules/User')
let jwt = require('jsonwebtoken')


function check (){
    let User = this
    let decoded ;
    let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2VkNWY3ODgxNTg1ODA5NmNmNGI0ZTYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTU5MDYwMzQ1fQ.avZJN0Dz0ZMeW7SttPglzaXNjzcri67kotaNivccfsc"
    try{
        decoded = jwt.verify(token,'fbdbdsjfbds494');
    }catch(e){
        console.log('error')

    }
    return User.findOne({
        "name" : "ahmed"
    })
}
let a = check()
console.log(a)