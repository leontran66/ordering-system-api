import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Order from '../models/Order';
import calculatePrice from '../util/calculatePrice';
import checkAdmin from '../util/checkAdmin';
import { isStatus } from '../util/validators';

export const get = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (order.user !== user && !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action', type: 'error' });
  }

  return res.status(200).json({ order, type: 'success' });
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const order = await Order.find({ user });
  if (!order.length) {
    return res.status(404).json({ message: 'Orders not found.', type: 'error' });
  }
  return res.status(200).json({ order, type: 'success' });
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { items } = req.body;
  let price = 0;

  const order = await Order.findOne({ user, type: 'cart' });
  if (order) {
    return res.status(401).json({ message: 'Cart already exists.', type: 'error' });
  }

  if (items) {
    // in the frontend, item has id, options, quantity and price with setFormData
    price = calculatePrice(items);
  }

  await Order.create({
    user,
    status: 'open',
    type: 'cart',
    items,
    price,
    notes: '',
  });

  return res.status(200).json({ message: 'Order created.', type: 'success' });
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const {
    status, notes,
  } = req.body;
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (order.user !== user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action', type: 'error' });
  }

  await check('status').trim().escape()
    .custom(isStatus)
    .withMessage('Invalid status')
    .run(req);
  await check('type').trim().escape().run(req);
  await check('notes').trim().escape().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await Order.findByIdAndUpdate(id, {
    status,
    notes,
  });

  return res.status(200).json({ message: 'Order updated.', type: 'success' });
};
