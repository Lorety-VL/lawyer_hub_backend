import { validationResult } from 'express-validator';
import ApiError from '../exceptions/apiError.js';
import lawyerService from '../services/lawyerService.js';


class LawyerController {
  async getAll(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const {
        page = 1,
        limit = 10,
        specializations,
        ...otherFilters
      } = req.query;

      const result = await lawyerService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        specializations: specializations ? specializations.split(',') : null,
        ...otherFilters
      });

      res.json({
        data: result.rows,
        pagination: {
          total: result.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(result.count / limit)
        }
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new LawyerController();
