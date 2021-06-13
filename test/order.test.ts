import request from 'supertest';
import {
  createCategory, createOrder, createOrderItem, createProduct, deleteCategory,
  deleteProduct, deleteOrder, deleteOrderItems, getCategory, getOrder, getProduct,
} from './testQueries';
import app from '../src/app';
import config from '../src/config';
import db from '../src/config/pg';

describe('order route', () => {
  describe('GET /api/order route', () => {
    test('no orders returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/order')
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Orders not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('GET /api/order/all route', () => {
    test('no orders returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/order/all')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Orders not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('GET /api/order/:id route', () => {
    test('no order returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/order/0');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Order not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('PATCH /api/order/:id route', () => {
    test('no order returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch('/api/order/0');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Order not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('GET /api/order route', () => {
    beforeAll(async () => {
      await db.none(createCategory, 'order');
      const category = await db.any(getCategory, 'order');
      await db.none(createProduct, {
        category: category.length && category[0].id,
        name: 'order',
        price: 1.00,
        description: 'order',
      });
      const product = await db.any(getProduct, 'order');
      await db.none(createOrder, {
        user: config.secrets.AUTH0_USER_ID,
        status: 'open',
        type: 'pickup',
        notes: '',
      });
      const order = await db.any(getOrder, 'open');
      await db.none(createOrderItem, {
        order: order.length && order[0].id,
        product: product.length && product[0].id,
        quantity: 1,
      });
    });

    test('valid input returns success and 200 OK', async () => {
      expect.assertions(4);
      const res = await request(app).get('/api/order')
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(200);
      expect(res.body.orders[0].status).toBe('open');
      expect(res.body.orders[0].type).toBe('pickup');
      expect(res.body.type).toBe('success');
    });
  });

  describe('GET /api/order/all route', () => {
    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/order/all');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/order/all')
        .send({
          user: 'test',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('non-admin user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/order/all')
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('valid input returns success and 200 OK', async () => {
      expect.assertions(4);
      const res = await request(app).get('/api/order/all')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
        });
      expect(res.status).toBe(200);
      expect(res.body.orders[0].status).toBe('open');
      expect(res.body.orders[0].type).toBe('pickup');
      expect(res.body.type).toBe('success');
    });
  });

  describe('GET /api/order/:id route', () => {
    let orderID: string;

    beforeAll(async () => {
      const order = await db.any(getOrder, 'open');
      orderID = order && order[0].id;
    });

    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get(`/api/order/${orderID}`);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).get(`/api/order/${orderID}`)
        .send({
          user: 'test',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('user owning order returns success and 200 OK', async () => {
      expect.assertions(4);
      const res = await request(app).get(`/api/order/${orderID}`)
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe('open');
      expect(res.body.order.type).toBe('pickup');
      expect(res.body.type).toBe('success');
    });

    test('admin returns success and 200 OK', async () => {
      expect.assertions(4);
      const res = await request(app).get(`/api/order/${orderID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
        });
      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe('open');
      expect(res.body.order.type).toBe('pickup');
      expect(res.body.type).toBe('success');
    });
  });

  describe('PATCH /api/order/:id route', () => {
    let orderID: string;

    beforeAll(async () => {
      const order = await db.any(getOrder, 'open');
      orderID = order && order[0].id;
    });

    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/order/${orderID}`)
        .send({
          status: 'closed',
          notes: 'closed',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/order/${orderID}`)
        .send({
          user: 'test',
          status: 'closed',
          notes: 'closed',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('non-admin user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/order/${orderID}`)
        .send({
          user: config.secrets.AUTH0_USER_ID,
          status: 'closed',
          notes: 'closed',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid inputs returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/order/${orderID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          status: '',
          notes: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Invalid status');
      expect(res.body.errors[0].param).toBe('status');
    });

    test('invalid status returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/order/${orderID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          status: 'test',
          notes: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Invalid status');
      expect(res.body.errors[0].param).toBe('status');
    });

    test('valid inputs returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/order/${orderID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          status: 'closed',
          notes: 'closed',
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Order updated.');
      expect(res.body.type).toBe('success');
    });
  });

  afterAll(async () => {
    await db.none(deleteOrderItems);
    await db.none(deleteOrder);
    await db.none(deleteProduct);
    await db.none(deleteCategory);
  });
});
