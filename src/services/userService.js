import ApiError from "../exceptions/apiError.js";
import { User, LawyerProfile, Specialization } from "../models/index.js";


class UserService {
  async getMe(userId) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'activationLink', 'createdAt', 'updatedAt']
      },
      include: [
        {
          model: LawyerProfile,
          attributes: ['id', 'userId'],
          required: false,
        }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getById(id) {
    const user = User.findOne({
      where: {
        id,
        isBlocked: false,
      },
      attributes: {
        exclude: [
          'password',
          'activationLink',
          'createdAt',
          'updatedAt',
          'phoneNumber',
          'isActivated',
          'email',
        ]
      },
      include: [{
        model: LawyerProfile,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'licenseNumber']
        },
        include: [{
          model: Specialization,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }]
      }]
    });

    if (!user) {
      throw ApiError.NotFound('User not found');
    }
    return user;
  }
}

export default new UserService();