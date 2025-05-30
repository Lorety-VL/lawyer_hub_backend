import { Specialization } from "../models/index.js";


class SpecializationService {
  async getAll() {
    return await Specialization.findAll();
  }
}

export default new SpecializationService();
