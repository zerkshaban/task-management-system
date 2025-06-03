const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const taskRouter = require('./routes/Task/task.route');

const port = 3000;

// middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:8080' }));

// routes
app.use('/api/tasks', taskRouter);

mongoose
  .connect(
    'mongodb+srv://zerkshaban00:TC848O8nixrgR7jv@taskmanagementsystem.c8srgrl.mongodb.net/?retryWrites=true&w=majority&appName=TaskManagementSystem'
  )
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
