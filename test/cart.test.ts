import request from 'supertest';
import app from '../src/app';
import config from '../src/config';
import db from '../src/config/pg';
import {
  deleteCart, deleteCartItems, createCategory, deleteCategory, getCategory,
  createProduct, deleteProduct, getProduct, getCartItem,
} from './testQueries';

describe('cart route', () => {
  let productID: string;

  beforeAll(async () => {
    await db.none(createCategory, 'cart');
    const category = await db.any(getCategory, 'cart');
    await db.none(createProduct, {
      category: category.length && category[0].id,
      name: 'cart',
      price: 1.00,
      description: 'cart',
    });
    const product = await db.any(getProduct, 'cart');
    productID = product.length && product[0].id;
  });

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

  describe('POST /api/cart/:id route', () => {
    test('no cart returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/cart/123')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          quantity: 2,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Cart not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('PATCH /api/cart/:id route', () => {
    test('no cart returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/cart/123')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          item: productID,
          quantity: 1,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Cart not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('DELETE /api/cart/:id route', () => {
    test('no cart returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/cart/123')
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Cart not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('PATCH /api/cart route', () => {
    test('no cart returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).patch('/api/cart')
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
      const res = await request(app).post('/api/cart');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('no input returns error and 400 Bad Request', async () => {
      expect.assertions(5);
      const res = await request(app).post('/api/cart')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          item: '',
          quantity: undefined,
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Item is required');
      expect(res.body.errors[0].param).toBe('item');
      expect(res.body.errors[1].msg).toBe('Quantity is required');
      expect(res.body.errors[1].param).toBe('quantity');
    });

    test('valid input returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/cart')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          item: productID,
          quantity: 1,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cart created.');
      expect(res.body.type).toBe('success');
    });

    test('alread existing cart returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/cart')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          item: productID,
          quantity: 1,
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Cart already exists.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('GET /api/cart route', () => {
    test('cart returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/cart')
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(200);
      expect(res.body.cart.user_id).toBe(config.secrets.AUTH0_USER_ID);
      expect(res.body.cart.status).toBe('cart');
    });
  });

  describe('POST /api/cart/:id route', () => {
    test('no input returns error and 400 Bad Request', async () => {
      expect.assertions(5);
      const res = await request(app).post('/api/cart/123')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          item: '',
          quantity: undefined,
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Item is required');
      expect(res.body.errors[0].param).toBe('item');
      expect(res.body.errors[1].msg).toBe('Quantity is required');
      expect(res.body.errors[1].param).toBe('quantity');
    });

    test('valid input returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/cart/123')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          item: productID,
          quantity: 1,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Item added to cart.');
      expect(res.body.type).toBe('success');
    });
  });

  describe('PATCH /api/cart/:id route', () => {
    let cartItemID: string;

    beforeAll(async () => {
      const cartItem = await db.any(getCartItem, productID);
      cartItemID = cartItem.length && cartItem[0].id;
    });

    test('no input returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/cart/${cartItemID}`)
        .send({
          user: config.secrets.AUTH0_USER_ID,
          quantity: undefined,
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Quantity is required');
      expect(res.body.errors[0].param).toBe('quantity');
    });

    test('valid input returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).patch(`/api/cart/${cartItemID}`)
        .send({
          user: config.secrets.AUTH0_USER_ID,
          quantity: 2,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cart item updated.');
      expect(res.body.type).toBe('success');
    });
  });

  describe('DELETE /api/cart/:id route', () => {
    let cartItemID: string;

    beforeAll(async () => {
      const cartItem = await db.any(getCartItem, productID);
      cartItemID = cartItem.length && cartItem[0].id;
    });

    test('valid input returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/cart/${cartItemID}`)
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cart item deleted.');
      expect(res.body.type).toBe('success');
    });
  });

  describe('PATCH /api/cart route', () => {
    test('no input returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).patch('/api/cart')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          type: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Type is required');
      expect(res.body.errors[0].param).toBe('type');
    });

    test('valid input returns success and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).patch('/api/cart')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          type: 'pickup',
        });
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Checkout completed.');
      expect(res.body.type).toBe('success');
    });
  });

  afterAll(async () => {
    await db.none(deleteCartItems, productID);
    await db.none(deleteCart);
    await db.none(deleteProduct, 'cart');
    await db.none(deleteCategory, 'cart');
  });
});
