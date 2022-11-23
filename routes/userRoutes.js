

const express = require ('express');
const { check } = require('express-validator');
const router = express.Router();
const {authenticateUsers, checkIfAdmin} = require ('../middleware/auth');

const controller =  require('../Controllers/usersController');


router.post('/signup', controller.registerNewUser);
router.post('/login', controller.loginUser);
router.get('/login', authenticateUsers, checkIfAdmin, controller.getLoggedInUser);


module.exports = router;