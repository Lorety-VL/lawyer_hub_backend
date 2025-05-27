import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';


const userRouter = express.Router();

userRouter.get('/',
  authMiddleware,
  checkRoleMiddleware(['moderator', 'admin']),
  userController.getUsers
)

userRouter.get('/me',
  authMiddleware,
  userController.getMe
)
export default userRouter;
