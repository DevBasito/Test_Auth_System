const express = require ('express');
const { check } = require('express-validator');
const router = express.Router();

const controller =  require('../Controllers/usersController');


router.post('/signup', controller.registerNewUser);
router.post('/login', [
    check('email', "Please Enter a Valid Email").isEmail,
    check("password", "A Valid Password is Required").exists
], controller.loginUser);


module.exports = router;