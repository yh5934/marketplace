let mongoose = require("mongoose");
let Schema   = mongoose.Schema;
let ObjectId = mongoose.Types.ObjectId;

mongoose.model("Listing", new mongoose.Schema({
    Title:{type:String},
    description:{type:String,maxlength:200},
    price:{type:Number,default:1,minlength:1},
    location:{type:String},
    img:{type:string},

    user:[{type:ObjectId, ref:"User"}]
    

},{timestamps:true}));