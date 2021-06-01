import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import Category from '../models/Category';
import checkAdmin from '../util/checkAdmin';

export const create = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { title } = req.body;

  const isAdmin = await checkAdmin(user);
  if (!user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  await check('title').notEmpty().trim().escape()
    .withMessage('Title is required')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await Category.create({
    title,
    products: [],
  });

  return res.status(200).json({ message: 'Category created.', type: 'success' });
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const categories = await Category.find({});
  if (!categories.length) {
    return res.status(404).json({ message: 'Categories not found.', type: 'error' });
  }
  return res.status(200).json({ categories, type: 'success' });
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (!user || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.', type: 'error' });
  }

  await Category.findByIdAndDelete(id);

  return res.status(200).json({ message: 'Category deleted.', type: 'success' });
};
