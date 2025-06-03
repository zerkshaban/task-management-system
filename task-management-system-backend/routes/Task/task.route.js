const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  deleteTask,
  updateTask,
  getQuickStats,
} = require('../../controllers/Task/task.controller');

router.post('/', createTask);
router.get('/', getAllTasks);
router.delete('/:id', deleteTask);
router.put('/:id', updateTask);

module.exports = router;
