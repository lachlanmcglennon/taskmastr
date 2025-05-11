const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTasks, createTask, getMessages, sendMessageREST, createTeam, joinTeam } = require('../controllers/teamController');

router.get('/:id/tasks', auth, getTasks);
router.post('/:id/tasks', auth, createTask);
router.get('/:id/messages', auth, getMessages);
router.post('/:id/messages', auth, sendMessageREST);
router.post('/', auth, createTeam);
router.post('/:id/join', auth, joinTeam);

module.exports = router;