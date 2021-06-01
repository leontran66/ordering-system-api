import {
  afterAll, describe, beforeAll, expect, test,
} from 'jest';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';
import config from '../src/config';
import Category from '../src/models/Category';

describe('category route', () => {
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

  describe('GET /api/category route', () => {
    test('no categories returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/category');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Categories not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('POST /api/category route', () => {
    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/category')
        .send({
          user: '',
          title: 'category',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/category')
        .send({
          user: 'test',
          title: 'category',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('non-admin user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/category')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          title: 'category',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid inputs returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/category')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          title: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Title is required');
      expect(res.body.errors[0].param).toBe('title');
    });

    test('valid inputs returns success and 200 OK', async () => {
      expect.assertions(5);
      const res = await request(app).post('/api/category')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          title: 'category',
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Category created.');
      expect(res.body.type).toBe('success');
      const category = await Category.findOne({ title: 'category' });
      expect(category).not.toBeNull();
      expect(category && category.products).toHaveLength(0);
    });
  });

  describe('GET /api/category route', () => {
    test('categories found returns categories array and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/category');
      expect(res.status).toBe(200);
      expect(res.body.categories[0].title).toBe('category');
      expect(res.body.type).toBe('success');
    });
  });

  describe('DELETE /api/category route', () => {
    let categoryID;

    beforeAll(async () => {
      const category = await Category.findOne({ title: 'category' });
      categoryID = category && category._id;
    });

    test('invalid id returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).delete('/api/category/123')
        .send({
          user: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid ID.');
      expect(res.body.type).toBe('error');
    });

    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/category/${categoryID}`)
        .send({
          user: '',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/category/${categoryID}`)
        .send({
          user: 'test',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('non-admin user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/category/${categoryID}`)
        .send({
          user: config.secrets.AUTH0_USER_ID,
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('category not found returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).delete(`/api/category/${mongoose.Types.ObjectId()}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Category not found.');
      expect(res.body.type).toBe('error');
    });

    test('valid inputs returns success and 200 OK', async () => {
      expect.assertions(4);
      const res = await request(app).delete(`/api/category/${categoryID}`)
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Category deleted.');
      expect(res.body.type).toBe('success');
      const category = await Category.findOne({ title: 'category' });
      expect(category).toBeNull();
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
  });
});
