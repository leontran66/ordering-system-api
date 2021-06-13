import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import db from '../config/pg';
import checkAdmin from '../util/checkAdmin';
import { isStatus } from '../util/validators';
import {
  getAllOrders, getAllOrdersForUser, getOrder, updateOrder,
} from '../util/queries';

export const get = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { id } = req.params;

  const order = await db.any(getOrder, id);
  if (!order.length) {
    return res.status(404).json({ message: 'Order not found.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (order[0].user_id !== user && !isAdmin) {
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

  const isAdmin = await checkAdmin(user);
  if (!isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action', type: 'error' });
  }

  const order = await db.any(getAllOrders);
  if (!order.length) {
    return res.status(404).json({ message: 'Orders not found.', type: 'error' });
  }
  return res.status(200).json({ order, type: 'success' });
};

export const getAllForUser = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const order = await db.any(getAllOrdersForUser, user);
  if (!order.length) {
    return res.status(404).json({ message: 'Orders not found.', type: 'error' });
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
    status, notes,
  } = req.body;
  const { id } = req.params;

  const order = await db.any(getOrder, id);
  if (!order.length) {
    return res.status(404).json({ message: 'Order not found.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (order[0].user !== user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action', type: 'error' });
  }

  await check('status').trim().escape()
    .custom(isStatus)
    .withMessage('Invalid status')
    .run(req);
  await check('notes').trim().escape().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await db.none(updateOrder, {
    status,
    notes,
    id,
  });

  return res.status(200).json({ message: 'Order updated.', type: 'success' });
};
