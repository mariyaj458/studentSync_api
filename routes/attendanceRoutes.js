const express = require("express");
const Attendance = require("../models/attendance");
const Student = require("../models/student");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");

const router = express.Router();

router.post("/", authenticate.verifyUser, async (req, res) => {
  try {
    // const markAttendance = new Attendance(req.body);
    const { studentId, date, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Ivalid StudentId" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }
    const exitstingRecord = await Attendance.findOne({ studentId, date });
    if (exitstingRecord) {
      return res
        .status(400)
        .json({ message: "Attendance already maked for this date" });
    }
    const newAttedance = new Attendance({ studentId, date, status });
    await newAttedance.save();
    res.status(201).json({
      message: "Attendance Marked Successfully",
      attendance: newAttedance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **  get Attendance by StudentID ** //
router.get("/student/:studentId", async (req, res) => {
  const { studentId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid Student ID" });
    }

    const attendanceRecords = await Attendance.find({ studentId }).sort({
      date: -1,
    }); //descending order

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ** get Attendance By Date ** //

router.get("/date/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const attendanceRecords = await Attendance.find({ date: new Date(date) });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ** update Attendance ** //

router.put("/:id", authenticate.verifyUser, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Present", "Absent"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Use 'Present' or 'Absent'" });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **  delete attendance by id ** //

router.delete("/:id", authenticate.verifyUser, async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
