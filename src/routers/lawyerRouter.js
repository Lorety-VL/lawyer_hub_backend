import express from 'express';
import { getLawyersValidator } from '../validators/getLawyersValidator.js';
import lawyerController from '../controllers/lawyerController.js';


const lawyerRouter = express.Router();

lawyerRouter.get('/', getLawyersValidator, lawyerController.getAll);

export default lawyerRouter;
