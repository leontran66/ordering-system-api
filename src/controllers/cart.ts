import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import db from '../config/pg';
import {
  createCart, createCartItem, deleteCartItem, getCart, getCartItem, updateCart, updateCartItem,
} from '../util/queries';

export const checkout = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { type, notes } = req.body;

  const cart = await db.any(getCart, user);
  if (!cart.length) {
    return res.status(400).json({ message: 'Cart not found.', type: 'error' });
  }

  await check('type').notEmpty().trim().escape()
    .run(req);
  await check('notes').trim().escape().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await db.none(updateCart, {
    type,
    notes,
  });

  return res.status(200).json({ message: 'Order updated.', type: 'success' });
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { item, quantity } = req.body;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const cart = await db.any(getCart, user);
  if (cart.length) {
    return res.status(401).json({ message: 'Cart already exists.', type: 'error' });
  }

  await check('item').notEmpty().trim().escape()
    .withMessage('Item is required')
    .run(req);
  await check('quantity').notEmpty().trim().escape()
    .withMessage('Quantity is required')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await db.none(createCart, user);

  const order = await db.any(getCart, user);
  await db.none(createCartItem, {
    order: order[0].id,
    item,
    quantity,
  });

  return res.status(200).json({ message: 'Cart created.', type: 'success' });
};

export const createItem = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { item, quantity } = req.body;

  const cart = await db.any(getCart, user);
  if (!cart.length) {
    return res.status(404).json({ message: 'Cart not found.', type: 'error' });
  }

  await check('item').notEmpty().trim().escape()
    .withMessage('Item is required')
    .run(req);
  await check('quantity').notEmpty().trim().escape()
    .withMessage('Quantity is required')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await db.none(createCartItem, {
    order: cart[0].id,
    item,
    quantity,
  });

  return res.status(200).json({ message: 'Item added to cart.', type: 'success' });
};

export const deleteItem = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }
  const { id } = req.params;

  const cart = await db.any(getCart, user);
  if (!cart.length) {
    return res.status(404).json({ message: 'Cart not found.', type: 'error' });
  }

  const cartItem = await db.any(getCartItem, id);
  if (!cartItem.length) {
    return res.status(404).json({ message: 'Item not found.', type: 'error' });
  }

  if (parseInt(cart[0].id, 10) !== parseInt(cartItem[0].order_id, 10)) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  await db.none(deleteCartItem, id);

  return res.status(200).json({ message: 'Cart item deleted.', type: 'success' });
};

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

  const cart = await db.any(getCart, user);
  if (!cart.length) {
    return res.status(404).json({ message: 'Cart not found.', type: 'error' });
  }

  return res.status(200).json({ cart: cart[0], type: 'success' });
};

export const updateItem = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }
  const { id } = req.params;

  const { quantity } = req.body;

  const cart = await db.any(getCart, user);
  if (!cart.length) {
    return res.status(404).json({ message: 'Cart not found.', type: 'error' });
  }

  const cartItem = await db.any(getCartItem, id);
  if (!cartItem.length) {
    return res.status(404).json({ message: 'Item not found.', type: 'error' });
  }

  if (parseInt(cart[0].id, 10) !== parseInt(cartItem[0].order_id, 10)) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  await check('quantity').notEmpty().trim().escape()
    .withMessage('Quantity is required')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await db.none(updateCartItem, {
    quantity,
    id,
  });

  return res.status(200).json({ message: 'Cart item updated.', type: 'success' });
};
