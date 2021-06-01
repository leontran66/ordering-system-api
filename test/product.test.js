/* import {
  afterAll, describe, beforeAll, expect, test,
} from 'jest';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';
import config from '../src/config';
import Product from '../src/models/Product';

describe('product route', () => {
  beforeAll(async () => {
    await mongoose.connect(config.secrets.MONGODB_URI_LOCAL || '', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }).catch(() => {
      process.exit(1);
    });
  });

  describe('GET /api/product route', () => {
    test('no products returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/product');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Products not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('GET /api/product/:id route', () => {
    test('invalid id returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).get(`/api/product/${mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('POST /api/product route', () => {
    test('no user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/product')
        .send({
          user: '',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/product')
        .send({
          user: 'test',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('non-admin user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/product')
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid inputs returns error and 400 Bad Request', async () => {
      expect.assertions(5);
      const res = await request(app).post('/api/product')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          name: '',
          price: '',
          options: [],
          extras: [],
          description: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].param).toBe('name');
      expect(res.body.errors[0].msg).toBe('Name is required');
      expect(res.body.errors[1].param).toBe('price');
      expect(res.body.errors[1].msg).toBe('Price is required');
    });

    test('invalid price returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/product')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          name: 'product',
          price: 'test',
          options: [],
          extras: [],
          description: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].param).toBe('price');
      expect(res.body.errors[0].msg).toBe('Price is invalid');
    });

    test('valid inputs returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/product')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          name: 'product',
          price: '5.00',
          options: [],
          extras: [],
          description: '',
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product created.');
      expect(res.body.type).toBe('success');
    });
  });

  describe('GET /api/product route', () => {
    test('products found returns products and 200 OK', async () => {
      expect.assertions(2);
      const res = await request(app).get('/api/product');
      expect(res.status).toBe(200);
      expect(res.body.products[0].name).toBe('product');
    });
  });

  describe('GET /api/product/:id route', () => {
    let productID;

    beforeAll(async () => {
      const product = await Product.findOne({ name: 'product' }).exec();
      productID = product && product._id;
    });

    test('product found returns product and 200 OK', async () => {
      expect.assertions(2);
      const res = await request(app).get(`/api/product/${productID}`);
      expect(res.status).toBe(200);
      expect(res.body.product.name).toBe('product');
    });
  });

  describe('PATCH /api/product/:id route', () => {
    let productID;

    beforeAll(async () => {
      const product = await Product.findOne({ name: 'product' }).exec();
      productID = product && product._id;
    });

    test('invalid id returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch('/api/product/123');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid ID.');
      expect(res.body.type).toBe('error');
    });

    test('no user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/product/${productID}`)
        .send({
          user: '',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/product/${productID}`)
        .send({
          user: 'test',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('non-admin user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/product/${productID}`)
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('product not found returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/product/${mongoose.Types.ObjectId()}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found.');
      expect(res.body.type).toBe('error');
    });

    test('invalid inputs returns error and 400 Bad Request', async () => {
      expect.assertions(5);
      const res = await request(app).patch(`/api/product/${productID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          name: '',
          price: '',
          options: [],
          extras: [],
          description: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].param).toBe('name');
      expect(res.body.errors[0].msg).toBe('Name is required');
      expect(res.body.errors[1].param).toBe('price');
      expect(res.body.errors[1].msg).toBe('Price is required');
    });

    test('invalid price returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/product/${productID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          name: 'product',
          price: 'test',
          options: [],
          extras: [],
          description: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].param).toBe('price');
      expect(res.body.errors[0].msg).toBe('Price is invalid');
    });

    test('valid inputs returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/product/${productID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          name: 'product',
          price: '10.00',
          options: [],
          extras: [],
          description: '',
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product updated.');
      expect(res.body.type).toBe('success');
    });
  });

  describe('DELETE /api/product/:id route', () => {
    let productID;

    beforeAll(async () => {
      const product = await Product.findOne({ name: 'product' }).exec();
      productID = product && product._id;
    });

    test('invalid returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).delete('/api/product/123');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid ID.');
      expect(res.body.type).toBe('error');
    });

    test('no user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/product/${productID}`)
        .send({
          user: '',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/product/${productID}`)
        .send({
          user: 'test',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('non-admin user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/product/${productID}`)
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('product not found returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/product/${mongoose.Types.ObjectId()}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found.');
      expect(res.body.type).toBe('error');
    });

    test('valid inputs returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/product/${productID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product deleted.');
      expect(res.body.type).toBe('success');
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
  });
}); */
