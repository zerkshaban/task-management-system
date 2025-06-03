const Task = require('../../models/Task/task.model');
const moment = require('moment');

const createTask = async (req, res) => {
  try {
    const { title, category, dueDate } = req.body;

    // Validate required fields
    if (!title || !category || !dueDate) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: title, category, and dueDate are required',
      });
    }

    // Validate dueDate is a valid date
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid due date format',
      });
    }

    // Create the task
    const task = await Task.create({
      ...req.body,
      dueDate: parsedDueDate,
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors)
          .map((val) => val.message)
          .join(', '),
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

const getStats = async (tasks) => {
  const todayDatetime = moment().utc();
  
  return {
    total: tasks.length,
    inProgress: tasks.filter((task) => task.status === 'in-progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
    overdue: tasks.filter(
      (task) => task.status !== 'completed' && moment(task.dueDate).utc().isBefore(todayDatetime)
    ).length,
    highPriority: tasks.filter((task) => task.priority === 'high').length
  };
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    const todayDatetime = moment().utc();

    const filteredTasks = tasks.filter((task) => {
      const taskDueDate = moment(task.dueDate).utc();
      return (
        task.status === 'in-progress' ||
        task.status === 'completed' ||
        todayDatetime.isBefore(taskDueDate)
      );
    });

    const stats = await getStats(tasks);

    return res.status(200).json({
      success: true,
      data: {
        tasks: tasks,
        stats,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching quick stats',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required',
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { deletedTaskId: id },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required',
      });
    }

    // Validate dueDate if it's being updated
    if (req.body.dueDate) {
      const parsedDueDate = new Date(req.body.dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid due date format',
        });
      }
      req.body.dueDate = parsedDueDate;
    }

    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors)
          .map((val) => val.message)
          .join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  deleteTask,
  updateTask,
};
