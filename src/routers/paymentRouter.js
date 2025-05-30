import express from 'express';
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import webhookCheck from '../middlewares/webhookCheck.js';


const paymentRouter = express.Router();

paymentRouter.post('/', authMiddleware, paymentController.createPayment);
paymentRouter.post('/webhook',
  // webhookCheck,
  paymentController.webhook
);


export default paymentRouter;
