const express = require('express');
const router = express.Router();
const { getUserName, getTeamMemberKeys } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware'); // optional

router.get('/:id', auth, getUserName);
router.get('/team/:id/members', auth, getTeamMemberKeys);
module.exports = router;