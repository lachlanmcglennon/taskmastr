const express = require('express');
const router = express.Router();
const { register, login, setPublicKey } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware'); // optional
router.post('/register', register);
router.post('/login', login);
router.post('/setPublicKey', auth, setPublicKey);
// Add public key for encryption

  
module.exports = router;