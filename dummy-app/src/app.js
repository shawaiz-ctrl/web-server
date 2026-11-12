const express = require('express');

const app = express();
app.use(express.json());

const startedAt = new Date().toISOString();

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from dummy-app!',
    version: process.env.APP_VERSION || 'local',
    startedAt,
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/greet/:name', (req, res) => {
  res.json({ greeting: `Hello, ${req.params.name}!` });
});

app.get('/api/sum', (req, res) => {
  const { a, b } = req.query;
  const x = Number(a);
  const y = Number(b);
  if (a === undefined || b === undefined || Number.isNaN(x) || Number.isNaN(y)) {
    return res.status(400).json({ error: 'Query params a and b must be numbers' });
  }
  res.json({ a: x, b: y, sum: x + y });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
