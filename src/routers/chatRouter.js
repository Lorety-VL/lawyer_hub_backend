import express from 'express';
import chatController from '../controllers/chatController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const chatRouter = express.Router();

chatRouter.post('/',
  authMiddleware,
  chatController.createChat
);

chatRouter.get('/',
  authMiddleware,
  chatController.getChats
);

chatRouter.post('/:chatId/messages',
  authMiddleware,
  chatController.sendMessage
);

chatRouter.get('/:chatId/messages',
  authMiddleware,
  chatController.getMessages
);

chatRouter.get('/:chatId/messages/poll',
  authMiddleware,
  chatController.pollMessages
);

export default chatRouter;