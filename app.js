const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')
const passport = require('passport')
const cookieParser = require('cookie-parser')


let {urlAtlas,urlLocal} = require(`./config/DB.js`)
let user = require('./routes/user')
let posts = require('./routes/posts')
let profile = require('./routes/profile')
let {authHome} = require('./middleware/authHome')


let app = express();
let port = 3000 || process.env.PORT;


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended :false}))
app.use(helmet())
app.use(morgan('tiny'))
app.use(passport.initialize())
app.use(cookieParser())

require('./config/passport')(passport)

app.use('/user',user);
app.use('/posts',posts);
app.use('/profile',profile);


app.set('view engine','pug')
app.set('views','./views')


mongoose.Promise = global.Promise
mongoose
    .connect(urlLocal,{useNewUrlParser : true})
    .then(()=>console.log('Atlas DB connected '))
    .catch((err)=>{
      console.log(err)
    })

//@Express  Get 
//@desc     Root
//@access   Puplic
    
app.get('/',authHome,(req,res)=>{
    res.render('index',{message : "this is a user"})
})



app.listen(port,()=>{
    console.log('server started');
});


