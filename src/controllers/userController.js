import _ from 'lodash';
import userService from '../services/userService.js';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/apiError.js';


class UserController {
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getMe(req, res, next) {
    try {
      const users = await userService.getMe(req.user.id);
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const { id } = req.params;
      const lawyer = await userService.getById(id);

      if (!lawyer) {
        throw ApiError.NotFound('Юрист не найден');
      }

      res.json(lawyer);
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      const userData = _.pick(req.body, [
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
      ]);
      const user = await userService.updateUser(req.user.id, userData, lawyerData);
      res.status(202).json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteMe(req, res, next) {
    try {
      await userService.deleteUser(req.user.id);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
