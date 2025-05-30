import db, { User, LawyerProfile, Specialization, Payment } from '../models/index.js';
import ApiError from '../exceptions/apiError.js';
import { Op } from 'sequelize';
import axios from 'axios';


class PaymentService {
  async createPayment(userId, lawyerId, redurectUrl) {
    const amount = process.env.CONTACT_PPRICE;
    const user = await User.findByPk(userId);
    const lawyer = await User.findByPk(lawyerId, { incluse: [{ model: LawyerProfile, required: true }] });
    const description = `Доступ к чату с юристом: ${lawyer.firstName}`.substring(0, 128);
    const returnUrl = redurectUrl || process.env.CLIENT_URL;
    if (!user) {
      throw ApiError.NotFound('User not found');
    }
    if (!lawyer) {
      throw ApiError.NotFound('Lawyer not found');
    }
    const transaction = await db.transaction();



    try {
      const payment = await Payment.create({
        status: 'pending',
        description,
        userId,
        lawyerId,
        amount,
      }, { transaction });

      const response = await axios.post(
        'https://api.yookassa.ru/v3/payments',
        {
          amount: {
            value: amount,
            currency: 'RUB'
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: returnUrl,
          },
          description: description
        },
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.YOOKASSA_CREDENTIALS).toString('base64')}`,
            'Idempotence-Key': payment.id,
            'Content-Type': 'application/json'
          }
        }
      );
      payment.kassaId = response.data.id;
      payment.paymentUrl = response.data.confirmation.confirmation_url;
      await payment.save({ transaction });

      await transaction.commit();
      return payment;
    } catch (error) {
      console.log(error)
      await transaction.rollback();
    }
  }

  async confirmPayment(kassaId) {
    const payment = await Payment.findOne({ where: { kassaId } });
    if (!payment) {
      throw ApiError.NotFound();
    }
    payment.status = 'succeeded';
    await payment.save();
  }

  async rejectPayment(kassaId) {
    const payment = await Payment.findOne({ where: { kassaId } });
    if (!payment) {
      throw ApiError.NotFound();
    }
    payment.status = 'canceled';
    await payment.save();
  }

  async getPaymentForUsers(userId, lawyerId) {
    return await Payment.findAll({
      where: {
        userId,
        lawyerId,
        status: 'succeeded',
      }
    });
  }
}

export default new PaymentService();