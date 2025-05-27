import { body } from 'express-validator';
import moment from 'moment';
import { clientRegisterValidator } from './clientRegisterValidator.js';


export const lawyerRegisterValidator = [
  ...clientRegisterValidator,

  body('aboutMe')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Описание не должно превышать 1000 символов'),

  body('education')
    .notEmpty()
    .withMessage('Образование обязательно')
    .isLength({ min: 10, max: 500 })
    .withMessage('Описание образования должно быть 10-500 символов'),

  body('region')
    .notEmpty()
    .withMessage('Регион обязателен')
    .isLength({ min: 2, max: 100 })
    .withMessage('Название региона 2-100 символов'),

  body('licenseNumber')
    .notEmpty()
    .withMessage('Номер лицензии обязателен')
    .matches(/^[A-Za-z0-9\-]{6,20}$/)
    .withMessage('Номер лицензии должен содержать 6-20 символов (буквы, цифры, дефисы)'),

  body('experienceStartDate')
    .notEmpty()
    .withMessage('Дата начала опыта работы обязательна')
    .custom((value) => {
      if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
        throw new Error('Неверный формат даты. Используйте ГГГГ-ММ-ДД');
      }
      if (moment(value).isAfter(moment())) {
        throw new Error('Дата начала опыта работы не может быть в будущем');
      }
      if (moment(value).isBefore(moment().subtract(50, 'years'))) {
        throw new Error('Дата начала опыта работы слишком давно');
      }
      return true;
    }),
];