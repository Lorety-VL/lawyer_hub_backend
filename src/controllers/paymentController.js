import _ from 'lodash';
import paymentService from '../services/paymentService.js';
import ApiError from '../exceptions/apiError.js';


class PaymentController {
  async createPayment(req, res, next) {
    const userId = req.user.id;
    const { lawyerId } = req.body;

    const payment = await paymentService.createPayment(userId, lawyerId);

    res.status(201).json(payment);
  }
}

export default new PaymentController();
