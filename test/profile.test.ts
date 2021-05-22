import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';
import config from '../src/config';
import Profile from '../src/models/Profile';

describe('profile route', () => {
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

  describe('GET /api/profile route', () => {
    test('no profile returns error and 404 Not Found', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/profile');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Profile not found.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('POST /api/profile route', () => {
    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/profile')
        .send({
          abn: '12 123 123 123',
          name: 'profile',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('non-admin user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/profile')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          abn: '12 123 123 123',
          name: 'profile',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/profile')
        .send({
          user: 'test',
          abn: '12 123 123 123',
          name: 'profile',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid inputs returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/profile')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          abn: '',
          name: '',
          phone: '',
          fax: '',
          address: '',
          suburb: '',
          state: '',
          postCode: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].param).toBe('abn');
      expect(res.body.errors[1].param).toBe('name');
    });

    test('partial address returns error and 400 Bad Request', async () => {
      expect.assertions(4);
      const res = await request(app).post('/api/profile')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          abn: '60 579 663 101',
          name: 'profile',
          address: 'hello world',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].param).toBe('suburb');
      expect(res.body.errors[1].param).toBe('state');
      expect(res.body.errors[2].param).toBe('postCode');
    });

    test('valid inputs returns success and 200 OK', async () => {
      expect.assertions(4);
      const res = await request(app).post('/api/profile')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          abn: '60 579 663 101',
          name: 'profile',
          phone: '1234 1234',
          fax: '1234 1234',
          address: 'hello world',
          suburb: 'hello world',
          state: 'QLD',
          postCode: '1234',
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Profile created.');
      expect(res.body.type).toBe('success');
      const profile = await Profile.findOne({ name: 'profile' });
      expect(profile).not.toBeNull();
    });

    test('already existing profile returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).post('/api/profile')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          abn: '60 579 663 101',
          name: 'profile',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Profile already exists.');
      expect(res.body.type).toBe('error');
    });
  });

  describe('GET /api/profile route', () => {
    test('profile found returns profile and 200 OK', async () => {
      expect.assertions(3);
      const res = await request(app).get('/api/profile');
      expect(res.status).toBe(200);
      expect(res.body.profile.abn).toBe('60 579 663 101');
      expect(res.body.profile.name).toBe('profile');
    });
  });

  describe('PATCH /api/profile route', () => {
    test('empty user returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch('/api/profile')
        .send({
          abn: '60 579 663 101',
          name: 'profile',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('not user\'s profile returns error and 401 Unauthorized', async () => {
      expect.assertions(3);
      const res = await request(app).patch('/api/profile')
        .send({
          user: config.secrets.AUTH0_USER_ID,
          abn: '60 579 663 101',
          name: 'profile',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized action.');
      expect(res.body.type).toBe('error');
    });

    test('invalid inputs returns error and 400 Bad Request', async () => {
      expect.assertions(3);
      const res = await request(app).patch('/api/profile')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          abn: '',
          name: '',
          phone: '',
          fax: '',
          address: '',
          suburb: '',
          state: '',
          postCode: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].param).toBe('abn');
      expect(res.body.errors[1].param).toBe('name');
    });

    test('partial address returns error and 400 Bad Request', async () => {
      expect.assertions(4);
      const res = await request(app).patch('/api/profile')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          abn: '60 579 663 101',
          name: 'profile',
          address: 'test',
          suburb: '',
          state: '',
          postCode: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].param).toBe('suburb');
      expect(res.body.errors[1].param).toBe('state');
      expect(res.body.errors[2].param).toBe('postCode');
    });

    test('valid inputs returns success and 200 OK', async () => {
      expect.assertions(6);
      const res = await request(app).patch('/api/profile')
        .send({
          user: config.secrets.AUTH0_ADMIN_ID,
          abn: '60 579 663 101',
          name: 'profile',
          phone: '1234 1234',
          fax: '1234 1234',
          address: 'test',
          suburb: 'test',
          state: 'QLD',
          postCode: '1234',
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Profile updated.');
      expect(res.body.type).toBe('success');
      const profile = await Profile.findOne({ name: 'profile' });
      expect(profile).not.toBeNull();
      expect(profile && profile.address).toBe('test');
      expect(profile && profile.suburb).toBe('test');
    });
  });

  afterAll(async () => {
    await Profile.deleteMany({ name: 'profile' }).exec();
    mongoose.connection.close();
  });
});
