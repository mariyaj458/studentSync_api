const express = require("express");
const Student = require("../models/student");
const mongoose = require("mongoose");
const logger = require("../middleware/logger");
const authenticate = require("../authenticate");
const cors = require("./cors");

const router = express.Router();

// ** GET All student details ** //
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find().populate("course.instructor");
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
});

// ** GET Student Details By Id ** //
router.options("/:id", cors.corsWithOptions);

router.get("/:id", cors.cors, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Student ID format" });
    }

    const student = await Student.findById(req.params.id).populate(
      "course.instructor"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
});

// ** Add Student ** //
router.post(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  async (req, res) => {
    try {
      const newStudent = new Student(req.body);
      await newStudent.save();
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// ** Update Student by Email ** //
router.put(
  "/update-by-email",
  cors.corsWithOptions,
  authenticate.verifyUser,
  async (req, res) => {
    try {
      const { email, updateData } = req.body;

      const updatedStudent = await Student.findOneAndUpdate(
        { email },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: "Student Not Found" });
      }
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ** Update Student by ID ** //
router.put(
  "/:id",
  cors.corsWithOptions,
  authenticate.verifyUser,
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Student ID format" });
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(updatedStudent);
    } catch (error) {
      next(error);
    }
  }
);

// ** Delete Student by ID ** //
router.delete(
  "/:id",
  cors.corsWithOptions,
  authenticate.verifyUser,
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Student ID format" });
      }

      const deletedStudent = await Student.findByIdAndDelete(req.params.id);

      if (!deletedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

// ** Delete All Students ** //
router.delete(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  async (req, res) => {
    try {
      const result = await Student.deleteMany({});
      if (!result) {
        return res.status(400).json({ message: "Error deleting students" });
      }
      res.status(200).json({ message: "All Students Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ** Add Course to Student ** //
router.post(
  "/:id/course",
  cors.corsWithOptions,
  authenticate.verifyUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const newCourse = {
        course_name: req.body.course_name,
        duration: req.body.duration,
        instructor: userId,
        details: req.body.details,
      };

      student.course.push(newCourse);
      await student.save();
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
