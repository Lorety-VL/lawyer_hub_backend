import jwt from 'jsonwebtoken';
import { Token } from '../models/index.js';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch {
      return null;
    }
  }

  async saveToken(userId, refreshToken, options = {}) {
    const tokenData = await Token.findOne({ where: { userId }, ...options });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save(options);
    }
    const token = await Token.create({ userId, refreshToken: refreshToken }, options);
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.destroy({ where: { refreshToken } });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ where: { refreshToken } });
    return tokenData;
  }
}

export default new TokenService();
