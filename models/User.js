const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["Student", "Mentor", "Admin"],
    default: "Student",
  },

  status: {
    type: String,
    enum: ["Active", "Pending"],
    default: "Pending",
  },

  skills: {
    type: [String],
    default: [],
  },

  // Add any other fields like score, resume, etc. if needed
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);
