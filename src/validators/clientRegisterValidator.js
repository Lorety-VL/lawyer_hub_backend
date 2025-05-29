import { body } from 'express-validator';
import moment from 'moment';

export const clientRegisterValidator = [
  body('email')
    .isEmail()
    .withMessage('Некорректный email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8, max: 32 })
    .withMessage('Пароль должен быть от 8 до 32 символов')
    .matches(/[0-9]/)
    .withMessage('Пароль должен содержать цифру')
    .matches(/[A-Z]/)
    .withMessage('Пароль должен содержать заглавную букву'),

  body('firstName')
    .notEmpty()
    .withMessage('Имя обязательно')
    .isLength({ min: 2 })
    .withMessage('Имя слишком короткое')
    .trim()
    .escape(),

  body('lastName')
    .notEmpty()
    .withMessage('Фамилия обязательна')
    .isLength({ min: 2 })
    .withMessage('Фамилия слишком короткая')
    .trim()
    .escape(),

  body('patronymic')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage('Отчество слишком короткое'),

  body('phoneNumber')
    .optional()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage('Неверный формат телефона'),

  body('birthDate')
    .notEmpty()
    .withMessage('Дата рождения обязательна')
    .isDate()
    .withMessage('Неверный формат даты')
    .custom((value) => {
      if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
        throw new Error('Неверный формат даты. Используйте ГГГГ-ММ-ДД');
      }

      const birthDate = moment(value);
      const minAgeDate = moment().subtract(18, 'years');

      if (birthDate.isAfter(minAgeDate)) {
        throw new Error('Пользователь должен быть старше 18 лет');
      }

      return true;
    }),

  body('gender')
    .notEmpty()
    .withMessage('Пол обязателен')
    .isIn(['male', 'female'])
    .withMessage('Неверное значение пола'),
];