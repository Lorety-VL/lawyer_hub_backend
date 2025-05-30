import _ from 'lodash';
import authService from '../services/authService.js';
import { validationResult } from "express-validator";
import ApiError from '../exceptions/apiError.js';
import jwt from 'jsonwebtoken';


class AuthController {
  async registerClient(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const userData = _.pick(req.body, [
        'email',
        'password',
        'firstName',
        'lastName',
        'phoneNumber',
        'gender',
        'birthDate',
        'patronymic',
      ]);
      const user = await authService.registerClient(userData);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async registerLawyer(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }
      const userData = _.pick(req.body, [
        'email',
        'password',
        'firstName',
        'lastName',
        'phoneNumber',
        'gender',
        'birthDate',
        'patronymic',
      ]);
      const lawyerData = _.pick(req.body, [
        'aboutMe',
        'price',
        'education',
        'region',
        'licenseNumber',
        'experienceStartDate',
        'specializations'
      ]);
      const user = await authService.registerLawyer(userData, lawyerData);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await authService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      await authService.forgotPassword(email);

      res.status(200).json({ message: 'Ссылка для сброса пароля отправлена на email' });
    } catch (e) {
      next(e)
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      await authService.resetPassword(token, password)

      res.status(202).json({ message: 'Пароль успешно изменен' });
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();