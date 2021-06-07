import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import db from '../config/pg';
import Option from '../types/option';
import checkAdmin from '../util/checkAdmin';
import { isPrice } from '../util/validators';
import {
  createProduct, createProductOptions, deleteProduct, deleteProductOptions,
  getProductById, getProductByName, getProducts, updateProduct, updateProductOptions,
} from '../util/queries';

export const create = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const {
    category, name, price, description, options,
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

  await db.none(createProduct, {
    category,
    name,
    price,
    description,
  });

  const id = await db.any(getProductByName, name);

  options.forEach(async (option: Option) => {
    await db.none(createProductOptions, {
      product_id: id[0],
      name: option.name,
      price: option.price,
    });
  });

  return res.status(200).json({ message: 'Product created.', type: 'success' });
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const product = await db.any(getProductById, id);
  if (!product.length) {
    return res.status(404).json({ message: 'Product not found.', type: 'error' });
  }
  return res.status(200).json({ product: product[0], type: 'success' });
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
  const products = await db.any(getProducts);
  if (!products.length) {
    return res.status(404).json({ message: 'Products not found.', type: 'error' });
  }
  return res.status(200).json({ products, type: 'success' });
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const {
    category, name, price, description, options,
  } = req.body;
  const { id } = req.params;

  const isAdmin = await checkAdmin(user);
  if (!user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const product = await db.any(getProductById, id);
  if (!product.length) {
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

  await db.none(updateProduct, {
    category,
    name,
    price,
    description,
    id,
  });

  options.forEach(async (option: Option) => {
    await db.none(updateProductOptions, {
      name: option.name,
      price: option.price,
      id: option.id,
    });
  });

  return res.status(200).json({ message: 'Product updated.', type: 'success' });
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { id } = req.params;

  const isAdmin = await checkAdmin(user);
  if (!user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const product = await db.any(getProductById, id);
  if (!product.length) {
    return res.status(404).json({ message: 'Product not found.', type: 'error' });
  }

  await db.none(deleteProduct, id);

  await db.none(deleteProductOptions, id);

  return res.status(200).json({ message: 'Product deleted.', type: 'success' });
};
