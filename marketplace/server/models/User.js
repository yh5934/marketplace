let mongoose = require("mongoose");
let Schema   = mongoose.Schema;
let ObjectId = mongoose.Types.ObjectId;

mongoose.model("User", new mongoose.Schema({
    first:{type:String, required:true, minlength:2},
    last:{type:String, required:true, minlength:2},
    email:{type:String, required:true},
    password:{type:String, required:true, minlength:8},
    confirm:{type:String, required:true, minlength:8},

    listing:[{type:ObjectId, ref:"Listing"}]
    // one user can have many listing
    // ref=hey what model do i look into for these listings? Listing model

},{timestamps:true}));