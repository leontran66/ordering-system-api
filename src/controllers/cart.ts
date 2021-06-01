import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Order from '../models/Order';
import calculatePrice from '../util/calculatePrice';
import { isStatus } from '../util/validators';

export const get = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const order = await Order.findOne({ user, status: 'cart' });
  if (!order) {
    return res.status(404).json({ message: 'Order not found.', type: 'error' });
  }

  return res.status(200).json({ order, type: 'success' });
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const {
    status, type, items, notes,
  } = req.body;
  const { id } = req.params;
  let price = 0;

  const order = await Order.findOne({ user, status: 'cart' });
  if (!order) {
    return res.status(404).json({ message: 'Order not found.', type: 'error' });
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

  if (items) {
    price = calculatePrice(items);
  }

  await Order.findByIdAndUpdate(id, {
    status,
    type,
    items,
    price,
    notes,
  });

  return res.status(200).json({ message: 'Order updated.', type: 'success' });
};
