import { query } from 'express-validator';


export const getLawyersValidator = [
  query('name')
    .optional()
    .isString()
    .withMessage('Имя должно быть строкой')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Имя должно быть от 2 до 50 символов'),

  query('specializations')
    .optional()
    .isArray()
    .withMessage('Специализации должны быть массивом'),

  query('specializations.*')
    .isString()
    .withMessage('Каждая специализация должна быть строкой'),

  query('priceFrom')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Минимальная цена должна быть числом от 0')
    .toInt(),

  query('priceTo')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Максимальная цена должна быть числом от 0')
    .toInt()
    .custom((value, { req }) => {
      if (req.query.priceFrom && value < req.query.priceFrom) {
        throw new Error('Максимальная цена должна быть больше минимальной');
      }
      return true;
    }),

  query('ratingFrom')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Рейтинг "от" должен быть от 0 до 5')
    .toFloat(),

  query('ratingTo')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Рейтинг "до" должен быть от 0 до 5')
    .toFloat()
    .custom((value, { req }) => {
      if (req.query.ratingFrom && value < req.query.ratingFrom) {
        throw new Error('Рейтинг "до" должен быть больше рейтинга "от"');
      }
      return true;
    }),

  query('sortBy')
    .optional()
    .isIn(['price', 'rating', 'experience'])
    .withMessage('Допустимые поля сортировки: price, rating, experience'),

  query('sortDirection')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Направление сортировки: asc или desc'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Номер страницы должен быть целым числом больше 0')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Лимит должен быть целым числом больше 0')
    .toInt()
];