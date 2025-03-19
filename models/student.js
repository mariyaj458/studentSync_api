const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name:{type:String,required:true},
    age:{type:Number,required:true},
    email:{type:String,required:true},
    course:{type:String,required:true},
});

const student = mongoose.model("Student",studentSchema);
module.exports = student;
