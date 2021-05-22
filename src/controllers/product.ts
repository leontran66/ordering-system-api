import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import Product from '../models/Product';
import checkAdmin from '../util/checkAdmin';
import { isPrice } from '../util/validators';

export const create = async (req: Request, res: Response): Promise<Response> => {
  // req.user.sub
  const {
    user, name, price, options, extras, description,
  } = req.body;

  const isAdmin = await checkAdmin(user);
  if (!user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  await check('name').notEmpty().trim().escape()
    .withMessage('Name is required')
    .run(req);
  await check('price').notEmpty().trim().escape()
    .withMessage('Price is required')
    .custom(isPrice)
    .withMessage('Price is invalid')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await Product.create({
    name,
    price,
    options,
    extras,
    description,
  });

  return res.status(200).json({ message: 'Product created.', type: 'success' });
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.', type: 'error' });
  }
  return res.status(200).json({ product, type: 'success' });
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
  const products = await Product.find({});
  if (!products.length) {
    return res.status(404).json({ message: 'Products not found.', type: 'error' });
  }
  return res.status(200).json({ products, type: 'success' });
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  // req.user.sub
  const {
    user, name, price, options, extras, description,
  } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (!user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.', type: 'error' });
  }

  await check('name').notEmpty().trim().escape()
    .withMessage('Name is required')
    .run(req);
  await check('price').notEmpty().trim().escape()
    .withMessage('Price is required')
    .custom(isPrice)
    .withMessage('Price is invalid')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await Product.findByIdAndUpdate(id, {
    name,
    price,
    options,
    extras,
    description,
  });

  return res.status(200).json({ message: 'Product updated.', type: 'success' });
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  // req.user.sub
  const { user } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (!user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.', type: 'error' });
  }

  await Product.findByIdAndDelete(id);

  return res.status(200).json({ message: 'Product deleted.', type: 'success' });
};
