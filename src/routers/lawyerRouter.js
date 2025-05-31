import express from 'express';
import { getLawyersValidator } from '../validators/getLawyersValidator.js';
import lawyerController from '../controllers/lawyerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';
import reviewController from '../controllers/reviewController.js';


const lawyerRouter = express.Router();

lawyerRouter.get('/', getLawyersValidator, lawyerController.getAll);
lawyerRouter.post('/:lawyerId/reviews',
  authMiddleware,
  checkRoleMiddleware(['client']),
  reviewController.createReview
);

// lawyerRouter.get('/:lawyerId/reviews',
//   authMiddleware,
//   reviewController.getReviews
// )

export default lawyerRouter;
