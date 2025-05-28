import { Op } from "sequelize";
import ApiError from "../exceptions/apiError.js";
import { User, LawyerProfile } from "../models/index.js";


class LawyerService {
  async getAll(filters) {
    const {
      page = 1,
      limit = 10,
      specializations,
      ...otherFilters
    } = filters;

    const where = {
      role: 'lawyer',
      isBlocked: false
    };

    if (otherFilters.name) {
      where.firstName = {
        [Op.iLike]: `%${otherFilters.name}%`
      };
    }

    const include = [{
      model: LawyerProfile,
      required: true,
      where: {},
      include: []
    }];

    if (specializations && specializations.length) {
      include[0].include.push({
        model: Specialization,
        where: { id: { [Op.in]: specializations } },
        through: { attributes: [] },
        required: true
      });
    }

    if (otherFilters.priceFrom || otherFilters.priceTo) {
      include[0].where.price = {
        [Op.between]: [
          otherFilters.priceFrom || 0,
          otherFilters.priceTo || 999999
        ]
      };
    }

    const order = [];
    if (otherFilters.sortBy) {
      const sortField = otherFilters.sortBy === 'experience'
        ? 'experienceStartDate'
        : otherFilters.sortBy;
      order.push([LawyerProfile, sortField, otherFilters.sortDirection || 'ASC']);
    }

    return await User.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });
  }
}

export default new LawyerService();