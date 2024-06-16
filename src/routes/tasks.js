const express = require('express');
const router = express.Router();
const task = require('../models/task');


router.get('/', async (req, res) => {
  const tasks = await task.find();
  res.json(tasks);
})

router.post('/', async (req, res) => {
  const task = new task(req.body);
  await task.save();
  res.json({
    status: 'Task saved'
  });
})

router.put('/:id', async (req, res) => {
  await task.findByIdAndUpdate(req.params.id, req.body);
  res.json({
    status: 'Task update'
  });
})

router.delete('/:id', async (req, res) => {
  await task.findByIdAndRemove(req.params.id, req.body);
  res.json({
    status: 'Task deleted'
  });
})

module.exports = router;