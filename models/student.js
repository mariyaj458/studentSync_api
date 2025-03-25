const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course_name: { type: String, required: true },
  duration: { type: Number, required: true }, // in months
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  details: { type: String, required: true },
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  course: [courseSchema],
});

const student = mongoose.model("Student", studentSchema);

module.exports = student;
