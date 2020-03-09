const express = require('express'),
      { User } = require('../model/user'),
      auth = require('../middleware/auth'),
      Joi = require('joi'),
      _ = require('lodash'),
      router = express.Router();

router.get("/", auth, async(req, res) => {
  const user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(400).send("Invalid profile");

  res.status(200).send(_.pick(user, ["username", "options"]));
});

router.patch("/", auth, async(req, res) => {  
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    $or: [{username: req.body.username}, {email: req.body.email}]
  });
  if(user) return res.status(401).send("Invalid email or username");

  const updates = _.pick(req.body, ["username", "email", "password"]);

  user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(404).send("User not found");

  user.set(updates);
  await user.save();

  res.status(200).send(_.pick(user, ["username"]));
});

router.delete("/", auth, async(req, res) => {
  const user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(404).send("User not found");
  
  await user.remove();
  res.status(200).send("Deleted");
});

function joiValidation(data) {
  const schema = {
    username: Joi.string().min(3).max(55).trim(),
    email: Joi.string().email().min(3).max(255).trim(),
    password: Joi.string().min(3).max(255).trim()
  };
  return Joi.validate(data, schema);
};

module.exports = router;      