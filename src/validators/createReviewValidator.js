import { body, param } from 'express-validator';

export const createReviewValidator = [
  param('lawyerId')
    .notEmpty()
    .withMessage('id юриста обязателен')
    .toInt(),

  body('rating')
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка должна быть от 1 до 5')
    .toInt(),

  body('text')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Длина отзыва должна быть от 10 до 1000 символов'),
];