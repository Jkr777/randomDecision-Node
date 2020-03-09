const mongoose = require('mongoose'),
      jwt = require('jsonwebtoken'),
      { optionSchema } = require('./option'),
      bcrypt = require('bcrypt'),
      Joi = require('joi');
      
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 55,
    lowercase: true,
    unique: true,
    trim: true,
    required: true
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    lowercase: true,
    unique: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  options: [optionSchema]
  
});

userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.create_token = function() {
  const token = jwt.sign({_id: this._id}, process.env.BORING_APP_JWT, { expiresIn: '15h' });
  return token;
};

userSchema.methods.check_password = async function(pass) {
  const checked = await bcrypt.compare(pass, this.password);
  return checked;
};

const User = mongoose.model("User", userSchema);

function joiVlaidation(data) {
  const schema = {
    username: Joi.string().min(3).max(55).trim().required(),
    email: Joi.string().email().min(3).max(255).trim().required(),
    password: Joi.string().min(3).max(255).trim().required()
  }
  return Joi.validate(data, schema);
};

exports.User = User;
exports.joiVlaidation = joiVlaidation;