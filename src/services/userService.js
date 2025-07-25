import ApiError from '../exceptions/apiError.js';
import { User, LawyerProfile, Specialization, Review } from '../models/index.js';


class UserService {
  async getMe(userId) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'activationLink']
      },
      include: [
        {
          model: Review,
          required: false,
          as: 'authoredReviews',
          include: [
            {
              model: User,
              required: true,
              as: 'lawyer',
              attributes: ['id', 'firstName', 'lastName', 'patronymic', 'avatarPath'],
            }
          ]
        },
        {
          model: LawyerProfile,
          required: false,
          include: [
            {
              model: Specialization,
              through: { attributes: [] },
              attributes: ['id', 'name']
            },
            {
              model: Review,
              required: false,
              as: 'reviews',
              include: [
                {
                  model: User,
                  required: true,
                  as: 'client',
                  attributes: ['id', 'firstName', 'lastName', 'patronymic', 'avatarPath'],
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) {
      throw ApiError.NotFound('User not found');
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
      include: [
        {
          model: LawyerProfile,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'licenseNumber']
          },
          include: [
            {
              model: Specialization,
              through: { attributes: [] },
              attributes: ['id', 'name']
            },
            {
              model: Review,
              required: false,
              as: 'reviews',
              include: [
                {
                  model: User,
                  required: true,
                  as: 'client',
                  attributes: ['id', 'firstName', 'lastName', 'patronymic', 'avatarPath'],
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) {
      throw ApiError.NotFound('User not found');
    }
    return user;
  }

  async updateUser(userId, clientValues, lawyerValues) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.NotFound('User not found');
    }
    user.update(clientValues);
    if (user.role === 'lawyer') {
      const lawyerProfile = await LawyerProfile.findOne({ where: { userId } });
      lawyerProfile.update(lawyerValues);
      if (lawyerValues.licenseNumber) {
        lawyerProfile.isConfirmed = false;
      }
      await lawyerProfile.save();
    }
    user.update();
    await user.save();
    return await User.findByPk(userId, {
      exclude: ['password'],
      include: [
        {
          model: LawyerProfile, exclude: [],
          include: [{ model: Specialization, exclude: [] }]
        },
      ]
    });
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.NotFound('User not found');
    }
    user.destroy({ cascade: true });
    return true;
  }

  async updateAvatar(userId, avatarPath) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.NotFound('User not found');
    }
    if (!avatarPath) {
      throw new ApiError.BadRequest('Empty avatar path');
    }
    user.avatarPath = avatarPath;
    await user.save();
  }
}

export default new UserService();