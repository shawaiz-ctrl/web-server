const request = require('supertest');
const app = require('../src/app');

describe('dummy-app', () => {
  test('GET / returns welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hello from dummy-app!');
    expect(res.body).toHaveProperty('version');
  });

  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/greet/:name greets the user', async () => {
    const res = await request(app).get('/api/greet/Ali');
    expect(res.status).toBe(200);
    expect(res.body.greeting).toBe('Hello, Ali!');
  });

  test('GET /api/sum adds two numbers', async () => {
    const res = await request(app).get('/api/sum?a=2&b=3');
    expect(res.status).toBe(200);
    expect(res.body.sum).toBe(5);
  });

  test('GET /api/sum rejects invalid input', async () => {
    const res = await request(app).get('/api/sum?a=foo&b=3');
    expect(res.status).toBe(400);
  });

  test('unknown route returns 404', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});
