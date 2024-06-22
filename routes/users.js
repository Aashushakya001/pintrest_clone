const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/pin")

const plm = require('passport-local-mongoose')

const userschema=mongoose.Schema({
  name:{
    type:String
  },
  username:{
    type:String
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }],
  email:{
    type:String
  },
  password:{
    type:String
  },
  contact:{
    type:Number
  },
  profileImage:{
    type:String
  },
  boards:{
    type:Array,
    default:[]
  }

})

userschema.plugin(plm)
module.exports = mongoose.model('User',userschema)