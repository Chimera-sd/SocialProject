const mongoose = require('mongoose')
const validator = require('validator')


const Schema = mongoose.Schema

let profileSchema = new Schema({
    user :{
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
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
    social :[{
        facebook :{
            type : String 
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        },
        instagram :{
            type : String 
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        },
        twitter :{
            type : String 
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        },
        linkedIn :{
            type : String 
            ,validate : {
                validator :(value)=> validator.isURL(value)
            }
        },
        github :{
            type : String
            ,validate : {
                validator :(value)=> validator.isURL(value)
            } 
        },
        youtube :{
            type : String 
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