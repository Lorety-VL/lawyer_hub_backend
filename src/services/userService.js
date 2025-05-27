import ApiError from "../exceptions/apiError.js";
import { User, LawyerProfile } from "../models/index.js";


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
}

export default new UserService();