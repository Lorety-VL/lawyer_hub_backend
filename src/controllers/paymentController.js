import _ from 'lodash';
import paymentService from '../services/paymentService.js';
import ApiError from '../exceptions/apiError.js';


class PaymentController {
  async createPayment(req, res, next) {
    const userId = req.user.id;
    const { lawyerId, redirectUrl } = req.body;

    const isPaymentsExist = await paymentService.getPaymentForUsers(userId, lawyerId);
    console.log(isPaymentsExist)
    if (isPaymentsExist.length > 0) {
      throw ApiError.Conflict('Payment between user and lawyer already exists');
    }

    const payment = await paymentService.createPayment(userId, lawyerId, redirectUrl);

    res.status(201).json(payment);
  }

  async getPayments(req, res, next) {
    const userId = req.user.id;
    const { lawyerId } = req.query;

    const isPaymentsExist = await paymentService.getPaymentForUsers(userId, lawyerId);
    console.log(isPaymentsExist)
    if (isPaymentsExist.length > 0) {
      throw ApiError.Conflict('Payment between user and lawyer already exists');
    }

    const payment = await paymentService.createPayment(userId, lawyerId, redirectUrl);

    res.status(201).json(payment);
  }

  async webhook(req, res, next) {
    const { event, object } = req.body;

    if (event === 'payment.succeeded') {
      await paymentService.confirmPayment(object.id);
      res.status(200).json({ ok: 'ok' });
    }
    if (event === 'payment.canceled') {
      await paymentService.rejectPayment(object.id);
      res.status(200).json({ status: 'ok' });
    }
    res.status(500).json({ status: 'error'});
  }
}

export default new PaymentController();
