import db, { User, LawyerProfile, Specialization, ResetToken } from '../models/index.js';
import { hash, compare } from 'bcrypt';
import { v4 } from 'uuid';
import mailService from './mailService.js';
import tokenService from './tokenService.js';
import UserDto from '../dtos/UserDto.js';
import ApiError from '../exceptions/apiError.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';


class AuthService {
  async registerClient(userData) {
    const candidate = await User.findOne({ where: { email: userData.email } });
    if (candidate) {
      throw ApiError.Conflict(`Пользователь с почтовым адресом ${userData.email} уже существует`);
    }
    const hashPassword = await hash(userData.password, 10);
    const activationLink = v4();

    const user = await User.create({
      ...userData,
      activationLink,
      role: 'client',
      password: hashPassword,
    });
    if (process.env.MODE === 'production') {
      await mailService.sendActivationMail(userData.email, `${process.env.API_URL}/api/v1/auth/activate/${activationLink}`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async registerLawyer(userData, lawyerData) {
    const candidate = await User.findOne({ where: { email: userData.email } });
    const lawyerCandidate = await LawyerProfile.findOne({
      where: { licenseNumber: lawyerData.licenseNumber }
    });
    if (candidate) {
      throw ApiError.Conflict(`Пользователь с почтовым адресом ${userData.email} уже существует`);
    }
    if (lawyerCandidate) {
      throw ApiError.Conflict('Пользователь с таким номером лицензии уже существует');
    }
    const hashPassword = await hash(userData.password, 3);
    const activationLink = v4();

    const transaction = await db.transaction();

    try {
      const user = await User.create({
        ...userData,
        activationLink,
        role: 'lawyer',
        password: hashPassword,
      }, { transaction });

      const lawyerProfile = await LawyerProfile.create({
        ...lawyerData,
        price: process.env.CONTACT_PPRICE,
        userId: user.id,
      }, { transaction });

      if (lawyerData.specializations) {
        const specializationsDb = await Specialization.findAll({
          where: {
            name: {
              [Op.in]: lawyerData.specializations
            }
          },
          transaction,
        });
        await lawyerProfile.addSpecializations(specializationsDb, { transaction });
      }
      await lawyerProfile.save({ transaction });

      if (process.env.MODE === 'production') {
        await mailService.sendActivationMail(userData.email, `${process.env.API_URL}/api/v1/auth/activate/${activationLink}`);
      }
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken, { transaction });

      await transaction.commit();
      return { ...tokens, user: userDto };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink } });
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации');
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest('Неверный пароль или логин');
    }
    const isPassEquals = await compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль или логин');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findByPk(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({ message: 'Если пользователь существует, письмо отправлено' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );

    await ResetToken.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 3600000)
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await mailService.sendPasswordResetEmail(user.email, resetLink);
  }

  async resetPassword(token, password) {
    const resetToken = await ResetToken.findOne({
      where: { token, used: false },
      include: [User]
    });

    if (!resetToken || new Date() > resetToken.expiresAt) {
      throw ApiError.BadRequest('Некорректная или просроченная ссылка');
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const hashedPassword = await hash(password, 10);

    await resetToken.User.update({ password: hashedPassword });

    await resetToken.update({ used: true });
  }
}

export default new AuthService();