const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTasks, createTask } = require('../controllers/teamController');

router.get('/:id/tasks', auth, getTasks);
router.post('/:id/tasks', auth, createTask);

module.exports = router;