const express = require('express'),
      _ = require('lodash'),
      { User } = require('../model/user'),
      Joi = require('joi'),
      router = express.Router();

router.post("/", async(req, res) => {
  const { error } = joiVlaidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(401).send("Invalid Email or password");

  const check_password = await user.check_password(req.body.password);
  if(!check_password) return res.status(401).send("Invalid Email or password");
  const token = user.create_token();

  res.status(200).header("x-auth", token).send(_.pick(user, ["username", "options"]));
});

function joiVlaidation(data) {
  const schema = {
    email: Joi.string().email().min(3).max(255).trim().required(),
    password: Joi.string().min(3).max(255).trim().required()
  }
  return Joi.validate(data, schema);
};

module.exports = router;