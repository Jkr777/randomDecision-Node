const express = require('express'),
      { User } = require('../model/user'),
      auth = require('../middleware/auth'),
      Joi = require('joi'),
      _ = require('lodash'),
      router = express.Router();

router.post("/", auth, async(req, res) => {
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOneAndUpdate(
    { _id: req.user._id, "options.text": {$ne: req.body.text}  },
    { $push: { options: [{text: req.body.text}] }},
    { 
      projection: { options: {$elemMatch: {text: req.body.text}}},
      new: true
    }
  );
  if(!user) return res.status(401).send("This option already exists");
  const newOption = user.options[0];
  
  res.status(201).send(newOption);
});

router.delete("/", auth, async(req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { options: []}}
  );
  if(!user) return res.status(404).send("User not found");

  res.status(200).send("Removed");
});

router.delete("/:id", auth, async(req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { options: { _id: req.params.id}}}
  );
  if(!user) return res.status(404).send("User not found");

  res.status(200).send("Removed");
});

function joiValidation(data) {
  const schema = {
    text: Joi.string().min(1).max(25).trim().required()
  };
  return Joi.validate(data, schema);
};

module.exports = router;