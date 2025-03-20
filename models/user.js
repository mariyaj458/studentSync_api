const mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model("User", userSchema);
module.exports = user;
