import request from 'supertest';
import {
  createCategory, deleteCategory, getCategory, getProduct,
} from './testQueries';
import app from '../src/app';
import config from '../src/config';
import db from '../src/config/pg';

describe('product route', () => {
  let categoryID: string;

  beforeAll(async () => {
    await db.none(createCategory, 'product');
    const category = await db.any(getCategory, 'product');
    categoryID = category.length && category[0].id;
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
      const res = await request(app).get('/api/product/123');
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
          category: categoryID,
          name: '',
          price: '',
          description: '',
          options: [],
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
          category: categoryID,
          name: 'product',
          price: 'test',
          description: '',
          options: [],
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
          category: categoryID,
          name: 'product',
          price: 5.00,
          description: '',
          options: [],
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
    let productID: string;

    beforeAll(async () => {
      const product = await db.any(getProduct, 'product');
      productID = product.length && product[0].id;
    });

    test('product found returns product and 200 OK', async () => {
      expect.assertions(2);
      const res = await request(app).get(`/api/product/${productID}`);
      expect(res.status).toBe(200);
      expect(res.body.product.name).toBe('product');
    });
  });

  describe('PATCH /api/product/:id route', () => {
    let productID: string;

    beforeAll(async () => {
      const product = await db.any(getProduct, 'product');
      productID = product.length && product[0].id;
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
      const res = await request(app).patch('/api/product/123')
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
          category: categoryID,
          name: '',
          price: '',
          description: '',
          options: [],
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
          category: categoryID,
          name: 'product',
          price: 'test',
          description: '',
          options: [],
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
          category: categoryID,
          name: 'product',
          price: 10.00,
          description: '',
          options: [],
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product updated.');
      expect(res.body.type).toBe('success');
    });
  });

  describe('DELETE /api/product/:id route', () => {
    let productID: string;

    beforeAll(async () => {
      const product = await db.any(getProduct, 'product');
      productID = product.length && product[0].id;
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
      const res = await request(app).delete('/api/product/123')
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
    await db.none(deleteCategory, 'product');
  });
});
