const express = require("express");
const Student = require("../models/student");
const mongoose = require("mongoose");
const logger = require("../middleware/logger");
const { error } = require("winston");

const router = express.Router();

// ** GET All student details ** //

router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find(); // Fetch all student documents
    res.status(200).json(students);
  } catch (error) {
    next(error);
    // res.status(500).json({message:error.message});
  }
});

// ** GET Student Details By Id ** //

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid Student ID format");
      error.status = 400;
      logger.error({
        message: error.message,
        method: "GET",
        route: req.originalUrl,
      });
      return res.status(400).json({ message: error.message });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      logger.error({
        message: error.message,
        method: "GET",
        route: req.originalUrl,
      });
      return res.status(404).json({ message: error.message });
    }

    res.status(200).json(student);
  } catch (error) {
    next(error); // Pass unexpected errors to the errorHandler
  }
});
// ** Add Student ** //

// router.post("/",async(req,res)=> {
//     try {
//         const newStudents = new Student(req.body); // Create a new Student document
//         await newStudents.save();  // Save the student to the database
//         res.status(201).json(newStudents); //Send the created student as a response
//     } catch (error) {
//         res.status(400).json({message:error.message});
//     }
// });

// ** Add Multiple Students At a time ** //

router.post("/", async (req, res, next) => {
  try {
    const students = await Student.insertMany(req.body);
    res.status(201).json(students);
  } catch (error) {
    // res.status(400).json({message:error.message});
    next(error);
  }
});

// ** udpdate Student By Filter ** //

router.put("/update-by-email", async (req, res) => {
  try {
    const { email, updateData } = req.body;

    const updateStudent = await Student.findOneAndUpdate(
      { email },
      updateData,
      { new: true, runValidators: true }
    );
    if (!updateStudent) {
      return res.status(404).json({ message: "Student Not Found" });
    }
    res.status(200).json(updateStudent);
  } catch (error) {
    console.log("lllllllllllllll");
    
    res.status(500).json({ message: error.message });
  }
});

// ** update student ** //

router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid Student ID format");
      error.status = 400;
      logger.error({
        message: error.message,
        method: "PUT",
        route: req.originalUrl,
      });
      return res.status(400).json({ message: error.message });
    }
    const updateStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updateStudent) {
      const error = new Error("Student not found");
      error.status = 404;
      logger.error({
        message: error.message,
        method: "PUT",
        route: req.originalUrl,
      });
      return res.status(404).json({ message: error.message });
    }

    res.status(200).json(updateStudent);
  } catch (error) {
    next(error);
    // res.status(500).json({message:error.message});
  }
});



// ** delete Student ** //

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid Student ID format");
      error.status = 400;
      logger.error({
        message: error.message,
        method: "DELETE",
        route: req.originalUrl,
      });
      return res.status(400).json({ message: error.message });
    }
    const deleteStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deleteStudent) {
      const error = new Error("Student not found");
      error.status = 404;
      logger.error({
        message: error.message,
        method: "DELETE",
        route: req.originalUrl,
      });
      return res.status(404).json({ message: error.message });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    // res.status(500).json({message:error.message});
    next(error);
  }
});

// ** Delete All Students ** //

router.delete("/", async (req, res) => {
  try {
    const result = await Student.deleteMany({});
    const error = new Error("All students deleted successfully");
    error.status = 500;
    if (!result) {
      logger.error({
        message: error.message,
        method: "DELETE",
        route: req.originalUrl,
      });
      return res.status(400).json({ message: error.message });
    }
    res.status(200).json({ message: "All Studenets Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
