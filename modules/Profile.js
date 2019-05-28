const mongoose = require('mongoose')
const validator = require('validator')


const Schema = mongoose.Schema

let profileSchema = new Schema({
    user :{
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    handle : {
        type : String,
        maxlength : 40,
        required : true
    },
    company : {
        type : String , 
        trim : true
    },
    location :{
        type : String , 
        trim : true
    },
    website : {
        type : URL ,
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
                type : String 
            },
            degree :{
                type : String
            },
            filedOfStudy :{
                type : String
            },
            from :{
                type : Date
            },
            to:{
                type : Date
            },
            current :{
                type : String
            },
            description :{
                type : String
            }
        }
    ],
    social :{
        facebook :{
            type : String 
        },
        instagram :{
            type : String 
        },
        twitter :{
            type : String 
        },
        linkedIn :{
            type : String 
        },
        github :{
            type : String 
        },
        youtube :{
            type : String 
        }
    },
    date : {
        type  : Date,
        default : Date.now()
    }
})

let Profile = mongoose.model('Profile',profileSchema)

module.exports = {
    Profile
}