const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: 1,
    maxlength: 25,
    trim: true,
    lowercase: true
  }
});

exports.optionSchema = optionSchema;