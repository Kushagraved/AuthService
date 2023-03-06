const express = require('express');
const { register, login, validateToken } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/validateToken', validateToken);



module.exports = router;

