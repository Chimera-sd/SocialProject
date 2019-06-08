const mongoose = require('mongoose')
const validator = require('validator')


const Schema = mongoose.Schema

let profileSchema = new Schema({
    user :{
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    age:{
        type : Number,
        required : true
    },
    company : {
        type : String , 
        trim : true,
        default : ' ',
    },
    location :{
        type : String , 
        trim : true,
        default : ' ',
    },
    website : {
        type : String ,
        trim : true ,
        validate : {
            validator :(value)=> validator.isURL(value)
        }
    },
    phoneNumber : {
        type : String,
        trim : true ,
        minlength : 6,
        validate : {
            validator :(value)=> validator.isMobilePhone(value)
        }
    },
    status : {
        type : String ,
        required : true,
        default : ' ',
        maxlength : 100
    },
    education : [
        {
            school :{
                type : String, 
                default : " "
            },
            degree :{
                type : String, 
                default : " "
            },
            filedOfStudy :{
                type : String, 
                default : " "
            },
            from :{
                type : Date
            },
            to:{
                type : Date
            },
            current :{
                type : String, 
                default : " "
            },
            description :{
                type : String, 
                default : " "
            }
        }
    ],
    social :[{
        facebook :{
            type : String, 
            default : "https://www.facebook.com/" 
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        },
        instagram :{
            type : String , 
            default : "https://www.instagram.com/"
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        },
        twitter :{
            type : String , 
            default : "https://www.twitter.com/"
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        },
        linkedIn :{
            type : String , 
            default : "https://www.linkedin.com/"
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        },
        github :{
            type : String, 
            default : "https://github.com/"
            ,validate : {
                validator :(value)=> validator.isURL(value)
            } 
        },
        youtube :{
            type : String , 
            default : "https://www.youtube.com/"
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        }
    }],
    date : {
        type  : Date,
        default : Date.now()
    }
})

let Profile = mongoose.model('Profile',profileSchema)

module.exports = {
    Profile
}