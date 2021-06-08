import request from 'supertest';
import app from '../src/app';
import config from '../src/config';
// import db from '../src/config/pg';

describe('cart route', () => {
  describe('GET /api/cart route', () => {
    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/cart');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('no cart returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/cart')
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Cart not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('POST /api/cart route', () => {
    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/cart');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('no cart returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/cart')
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Cart not found.');
      expect(res.body.type).toBe('error');
    });
  });
});
