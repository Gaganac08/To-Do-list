const express = require('express');
const todosRouter = require('./routes/todos');
const summarizeRouter = require('./routes/summarize');

const app = express();
app.use(express.json());
app.use('/todos', todosRouter);
app.use('/summarize', summarizeRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;