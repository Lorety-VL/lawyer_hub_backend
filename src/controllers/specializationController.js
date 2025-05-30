import specializationService from '../services/specializationService.js';


class SpecializationController {
  async getAll(req, res, next) {
    try {
      const specializations = await specializationService.getAll();
      res.status(200).json(specializations);
    } catch (e) {
      next(e);
    }
  }
}

export default new SpecializationController();
