const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`dummy-app listening on port ${PORT} (version: ${process.env.APP_VERSION || 'local'})`);
});

// Graceful shutdown so `docker stop` doesn't wait for the kill timeout
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down...`);
  server.close(() => process.exit(0));
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
