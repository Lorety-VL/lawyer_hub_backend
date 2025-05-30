import express from 'express';
import authController from '../controllers/authController.js';
import { clientRegisterValidator } from '../validators/clientRegisterValidator.js';
import { lawyerRegisterValidator } from '../validators/lawyerRegisterValidator.js';


const authRouter = express.Router();

authRouter.post('/registerClient',
  clientRegisterValidator,
  authController.registerClient,
);
authRouter.post('/registerLawyer',
  lawyerRegisterValidator,
  authController.registerLawyer,
);

authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/activate/:link', authController.activate);
authRouter.get('/refresh', authController.refresh);

authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password/:token', authController.resetPassword);

export default authRouter;
