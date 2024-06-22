const mongoose=require("mongoose")


const postschema=mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  title:{
    type:String
  },
  description:{
    type:String
  },
  image:{
    type:String
  }

})

module.exports = mongoose.model('Post',postschema)