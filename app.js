let express = require('express');
let mongoose = require('mongoose');
let bodyparser = require('body-parser')

let {urlAtlas,urlLocal} = require(`./config/obj.js`)
let user = require('./routes/api/user')
let posts = require('./routes/api/posts')
let profile = require('./routes/api/profile')


let app = express();
let port = 3000 || process.env.PORT;

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended :false}))
app.use('/api/user',user);
app.use('/api/posts',posts);
app.use('/api/profile',profile);


mongoose.Promise = global.Promise
mongoose
    .connect(urlAtlas)
    .then(()=>console.log('Atlas DB connected '))
    .catch((err)=>{
      console.log(err)
    })

//@Express  Get 
//@desc     Root
//@access   Puplic
    
app.get('/',(req,res)=>{
    res.json({
        'msg' : "from get root"
    })
})



app.listen(port,()=>{
    console.log('server started');
});


