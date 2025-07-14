// models/Problem.js
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  inputFormat: String,
  outputFormat: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  company: [String],
  testCases: [{ input: String, output: String }],
  tags: [String]
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
