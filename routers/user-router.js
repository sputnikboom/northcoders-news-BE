const userRouter = require('express').Router();
const {getUserById} = require('../controllers/users');

userRouter.route("/:username").get(getUserById);

module.exports = userRouter;