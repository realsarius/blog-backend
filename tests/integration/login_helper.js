const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);

const loginAndGetToken = async (username, password) => {
  const response = await api
    .post('/api/login')
    .send({ username, password });

  return response.body.token;
};

module.exports = { loginAndGetToken };
