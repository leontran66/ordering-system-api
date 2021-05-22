import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import config from './config';

import * as category from './controllers/category';
import * as product from './controllers/product';
import * as profile from './controllers/profile';
import errorHandler from './util/errorHandler';

const app = express();

app.set('port', process.env.PORT || 5000);
app.set('env', process.env.NODE_ENV || 'development');
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet(config.helmet));
app.use(config.morgan);

app.get('/admin', (req: Request, res: Response) => {
  res.send('hello world');
});

app.get('/api/category', category.get);
app.post('/api/category', category.create);
app.delete('/api/category/:id', category.remove);
app.get('/api/product', product.getAll);
app.get('/api/product/:id', product.get);
app.post('/api/product', product.create);
app.patch('/api/product/:id', product.update);
app.delete('/api/product/:id', product.remove);
app.get('/api/profile', profile.get);
app.post('/api/profile', profile.create);
app.patch('/api/profile', profile.update);

app.use(errorHandler);

export default app;
