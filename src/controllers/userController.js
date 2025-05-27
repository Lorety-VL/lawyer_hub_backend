import _ from 'lodash';
import userService from '../services/userService.js';
import { validationResult } from "express-validator";
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
}

export default new UserController();
