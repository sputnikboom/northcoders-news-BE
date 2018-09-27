const { User } = require("../models");

const getUserById = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) throw { status: 404 };
      else res.send({ user });
    })
    .catch(err => next(err));
};

module.exports = { getUserById };
