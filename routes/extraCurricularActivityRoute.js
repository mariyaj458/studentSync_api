const express = require("express");
const ExtraCurricularActivity = require("../models/extraCurricularActivity");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Student = require("../models/student");
const mongoose = require("mongoose");

const router = express.Router();

router.post(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  async (req, res) => {
    try {
      const { studentId, activityName, description } = req.body;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ message: "Invalid student ID format" });
      }

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      let extraActivity = await ExtraCurricularActivity.findOne({
        user: userId,
      });

      if (!extraActivity) {
        extraActivity = new ExtraCurricularActivity({
          user: userId,
          activities: [],
        });
      }
      extraActivity.activities.push({
        student: studentId,
        activityName,
        description,
      });

      await extraActivity.save();
      res.status(200).json(extraActivity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/", authenticate.verifyUser, async (req, res) => {
  try {
    const extraActivity = await ExtraCurricularActivity.findOne({
      user: req.user._id,
    }).populate("activities.student");
    if (!extraActivity) {
      return res
        .status(404)
        .json({ message: "No extra-Cirriclar activites foound" });
    }
    res.status(200).json(extraActivity.activities);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:activityId", authenticate.verifyUser, async (req, res) => {
  try {
    const extraActivity = await ExtraCurricularActivity.findOne({
      user: req.user._id,
    });

    if (!extraActivity) {
      return res
        .status(404)
        .json({ message: "No extra-curricular activities found" });
    }

    extraActivity.activities = extraActivity.activities.filter(
      (activity) => activity._id.toString() !== req.params.activityId
    );

    await extraActivity.save();
    res.status(200).json(extraActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
