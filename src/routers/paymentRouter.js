import express from 'express';
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const paymentRouter = express.Router();

paymentRouter.post('/', authMiddleware, paymentController.createPayment);

export default paymentRouter;
