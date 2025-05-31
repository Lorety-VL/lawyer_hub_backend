import { Op } from 'sequelize';
import ApiError from '../exceptions/apiError.js';
import { User, LawyerProfile, Specialization } from '../models/index.js';


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
      isBlocked: false,
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
      // where: { isConfirmed: true },
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'licenseNumber',
          'isConfirmed'
        ]
      },
      include: [
        {
          model: Specialization,
          where: {},
          through: { attributes: [] },
          required: false,
          attributes: ['id', 'name'],
        }
      ]
    }];

    console.log(otherFilters);

    if (otherFilters.ratingFrom > 0 || otherFilters.ratingTo < 5) {
      include[0].where.rating = {};

      if (otherFilters.ratingFrom) {
        include[0].where.rating[Op.gte] = otherFilters.ratingFrom;
      }

      if (otherFilters.ratingTo) {
        include[0].where.rating[Op.lte] = otherFilters.ratingTo;
      }
    }

    if (specializations) {
      include[0].include[0].where = {
        name: {
          [Op.in]: specializations
        }
      };
      include[0].include[0].required = true;
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
      attributes: {
        exclude: [
          'password',
          'activationLink',
          'createdAt',
          'updatedAt',
          'phoneNumber',
          'userStatus',
          'email',
          'isActivated',
        ]
      },
      where,
      include,
      order,
      limit,
      offset: (page - 1) * limit,
      distinct: true,
      subQuery: false,
    });
  }


}

export default new LawyerService();