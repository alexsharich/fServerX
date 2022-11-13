import { body } from 'express-validator'

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('fullName').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL(),
]
export const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
]
export const postCreateValidation = [
  body('title', 'Enter the title').isLength({ min: 3 }).isString(),
  body('text', 'Enter the text').isLength({ min: 3 }).isString(),
  body('tags', 'Check tags format').optional().isString(),
  body('imageUrl', 'Invalid link to image').optional().isString(),
]