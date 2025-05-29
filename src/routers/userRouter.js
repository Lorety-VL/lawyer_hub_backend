import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';
import { param } from 'express-validator';


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

userRouter.patch('/me',
  authMiddleware,
  userController.updateMe
)

userRouter.delete('/me',
  authMiddleware,
  userController.deleteMe
)

userRouter.get('/:id', [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID пользователя должен быть положительным числом')
    .toInt()
], userController.getUser);

userRouter.patch('/me/avatar',
  authMiddleware,
  userController.setAvatar
)
export default userRouter;
