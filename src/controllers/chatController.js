import chatService from '../services/chatService.js';


class ChatController {
  async createChat(req, res, next) {
    try {
      const chat = await chatService.createChat(
        req.user.id,
        req.body.targetUserId,
      );
      res.status(201).json(chat);
    } catch (error) {
      next(error);
    }
  }

  async getChats(req, res, next) {
    try {
      const chats = await chatService.getUserChats(req.user.id);
      res.json(chats);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const message = await chatService.sendMessage(
        req.params.chatId,
        req.user.id,
        req.body.text
      );
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const messages = await chatService.getMessages(
        req.params.chatId,
        req.query.lastMessageId
      );
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  async pollMessages(req, res, next) {
    try {
      const messages = await chatService.getMessages(
        req.params.chatId,
        req.query.lastMessageId
      );
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();