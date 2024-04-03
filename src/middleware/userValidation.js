import { body } from 'express-validator';

const userRegistrationValidation = [
  body('username').isString().trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').isString().trim().notEmpty().withMessage('First name is required'),
  body('lastName').isString().trim().notEmpty().withMessage('Last name is required'),
  body('roomNumber').isNumeric().withMessage('Room number must be numeric'),
];

const userLoginValidation = [
    body('username').isString().trim().notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

export { userRegistrationValidation, userLoginValidation };
