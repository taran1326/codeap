


const port = 3000;
const request = require('supertest');
const express = require('express');
const app = express();


const router = express.Router();
const postsApi = require("../controllers/api/v1/posts_api");
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});


jest.setTimeout(200000);


const postsRouter = require('../routes/api/v1/posts');
app.use('/api/v1/posts', postsRouter);

describe('Test the /api/v1/posts endpoint', () => {
  test('It should respond with 200 for GET request', async () => {
    const response = await request(app).get('/api/v1/posts');
    expect(response.statusCode).toBe(200);
  });
});
