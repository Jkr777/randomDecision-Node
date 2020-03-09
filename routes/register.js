const express = require('express'),
      { User, joiVlaidation } = require('../model/user'),
      _ = require('lodash'),
      router = express.Router();

router.post("/", async(req, res) => {
  const { error } = joiVlaidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    $or: [{username: req.body.username}, {email: req.body.email}]
  });
  if(user) return res.status(401).send("Invalid email or username");

  user = new User(_.pick(req.body, ["username", "email", "password"]));
  await user.save();
  const token = user.create_token();

  res.status(201).header("x-auth", token).send(_.pick(user, ["username", "options"]));

});

module.exports = router;      