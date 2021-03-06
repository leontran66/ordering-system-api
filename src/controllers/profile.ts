import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import checkAdmin from '../util/checkAdmin';
import { isABN, isAddress } from '../util/validators';
import db from '../config/pg';
import {
  createProfile, getOwnProfile, getProfile, updateProfile,
} from '../util/queries';

export const create = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const {
    abn, name, phone, fax, address, suburb, state, postCode,
  } = req.body;

  const profile = await db.any(getProfile);
  if (profile.length) {
    return res.status(401).json({ message: 'Profile already exists.', type: 'error' });
  }

  await check('abn').notEmpty().trim().escape()
    .withMessage('ABN is required')
    .custom(isABN)
    .withMessage('ABN is invalid')
    .run(req);
  await check('name').notEmpty().trim().escape()
    .withMessage('Name is required')
    .run(req);
  await check('phone').trim().escape().run(req);
  await check('fax').trim().escape().run(req);
  await check('address').trim().escape().run(req);
  await check('suburb').trim().escape().run(req);
  await check('state').trim().escape().run(req);
  await check('postCode').trim().escape().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const addressErrors = isAddress(address, suburb, state, postCode);
  if (addressErrors.length) {
    return res.status(400).json({ errors: addressErrors });
  }

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const isAdmin = await checkAdmin(user);
  if (!isAdmin) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  await db.none(createProfile,
    {
      user,
      name,
      abn,
      phone,
      fax,
      address,
      suburb,
      state,
      postCode,
    });

  return res.status(200).json({ message: 'Profile created.', type: 'success' });
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const profile = await db.any(getProfile);
  if (!profile.length) {
    return res.status(404).json({ message: 'Profile not found.', type: 'error' });
  }

  return res.status(200).json({ profile: profile[0] });
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  let user: string;

  if (process.env.NODE_ENV === 'production') {
    user = req.user.sub;
  } else {
    user = req.body.user;
  }

  const {
    abn, name, phone, fax, address, suburb, state, postCode,
  } = req.body;

  await check('abn').notEmpty().trim().escape()
    .withMessage('ABN is required')
    .custom(isABN)
    .withMessage('ABN is invalid')
    .run(req);
  await check('name').notEmpty().trim().escape()
    .withMessage('Name is required')
    .run(req);
  await check('phone').trim().escape().run(req);
  await check('fax').trim().escape().run(req);
  await check('address').trim().escape().run(req);
  await check('suburb').trim().escape().run(req);
  await check('state').trim().escape().run(req);
  await check('postCode').trim().escape().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const addressErrors = isAddress(address, suburb, state, postCode);
  if (addressErrors.length) {
    return res.status(400).json({ errors: addressErrors });
  }

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  const profile = await db.any(getOwnProfile, user);
  if (!profile.length) {
    return res.status(401).json({ message: 'Unauthorized action.', type: 'error' });
  }

  db.none(updateProfile, {
    abn,
    name,
    phone,
    fax,
    address,
    suburb,
    state,
    postCode,
    user,
  });

  return res.status(200).json({ message: 'Profile updated.', type: 'success' });
};
