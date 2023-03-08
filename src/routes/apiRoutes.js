const express = require('express');
const { register, login, validateToken, getUserById } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/validateToken', validateToken);


router.get('/getUserById/:id', getUserById);



module.exports = router;

