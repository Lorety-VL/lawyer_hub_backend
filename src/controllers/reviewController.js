import _ from 'lodash';
import { validationResult } from "express-validator";
import ApiError from '../exceptions/apiError.js';
import reviewService from '../services/reviewService.js';


class RewiewController {
  async createReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }
      const { lawyerId } = req.params;
      const { id } = req.user;
      const reviewData = _.pick(req.body, [
        'text',
        'rating',
      ]);
      const review = await reviewService.createReview(id, lawyerId, reviewData);
      res.status(201).json(review);
    } catch (e) {
      next(e);
    }
  }
}

export default new RewiewController();
