const mongoose = require("mongoose");

const extraCurricularActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activities: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      activityName: {
        type: String,
        required: true,
      },
      description: { type: String },
    },
  ],
});

const ExtraCurricularActivity = mongoose.model(
  "ExtraCrricularActivity",
  extraCurricularActivitySchema
);
module.exports = ExtraCurricularActivity;
