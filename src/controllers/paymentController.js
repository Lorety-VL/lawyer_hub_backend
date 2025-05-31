import paymentService from '../services/paymentService.js';


class PaymentController {
  async createPayment(req, res, next) {
    try {
      const userId = req.user.id;
      const { lawyerId, redirectUrl } = req.body;

      // const isPaymentsExist = await paymentService.getPaymentForUsers(userId, lawyerId);
      // if (isPaymentsExist.length > 0) {
      //   throw ApiError.Conflict('Payment between user and lawyer already exists');
      // }

      const payment = await paymentService.createPayment(userId, lawyerId, redirectUrl);

      res.status(201).json(payment);
    } catch (e) {
      next(e);
    }
  }

  async webhook(req, res, next) {
    try {
      const { event, object } = req.body;

      if (event === 'payment.succeeded') {
        await paymentService.confirmPayment(object.id);
        return res.status(200).json({ ok: 'ok' });
      }
      if (event === 'payment.canceled') {
        await paymentService.rejectPayment(object.id);
        return res.status(200).json({ status: 'ok' });
      }
      res.status(200).json({ status: 'error' });
    } catch (e) {
      next(e);
    }
  }
}

export default new PaymentController();
