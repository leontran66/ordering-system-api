import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import db from '../config/pg';
import checkAdmin from '../util/checkAdmin';
import {
  createCategory, getCategories, getCategory, deleteCategory,
} from '../util/queries';

export const create = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const { title } = req.body;

  await check('title').notEmpty().trim().escape()
    .withMessage('Title is required')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (!isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  await db.none(createCategory, {
    title,
  });

  return res.status(200).json({ message: 'Category created.', type: 'success' });
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const categories = await db.any(getCategories);
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

  const category = await db.any(getCategory, id);
  if (category[0].count <= 0) {
    return res.status(404).json({ message: 'Category not found.', type: 'error' });
  }

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (!isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  await db.none(deleteCategory, id);

  return res.status(200).json({ message: 'Category deleted.', type: 'success' });
};
