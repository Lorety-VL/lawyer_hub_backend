import _ from 'lodash';
import paymentService from '../services/paymentService.js';
import ApiError from '../exceptions/apiError.js';


class PaymentController {
  async createPayment(req, res, next) {
    const userId = req.user.id;
    const { lawyerId, redirectUrl } = req.body;

    const payment = await paymentService.createPayment(userId, lawyerId, redirectUrl);

    res.status(201).json(payment);
  }

  async webhook(req, res, next) {
    const { event, object } = req.body;

    if (event === 'payment.succeeded') {
      await paymentService.confirmPayment(object.id);
    }
    if (event === 'payment.canceled') {
      await paymentService.rejectPayment(object.id);
    }
    res.status(200).json({ ok: 'ok' });
  }
}

export default new PaymentController();
