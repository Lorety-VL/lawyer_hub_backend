import { Op } from 'sequelize';
import sequelize, { Chat, Message, ChatUser, User } from '../models/index.js';
import ApiError from '../exceptions/apiError.js';


class ChatService {
  async createChat(userId, lawyerId) {
    const targetUser = await User.findByPk(lawyerId);
    if (!targetUser) {
      throw ApiError.NotFound('Target user not found');
    }
    let chat = await this.findChatBetweenUsers(userId, lawyerId);
    if (!chat) {
      chat = await Chat.create();
      await ChatUser.create({ userId, chatId: chat.id, role: 'creator' });
      await ChatUser.create({ userId: lawyerId, chatId: chat.id, role: 'member' });
    }
    return chat;
  }

  async getUserChats(userId) {
    const userChats = await ChatUser.findAll({
      where: { userId },
      attributes: ['chatId']
    });

    const chatIds = userChats.map(c => c.chatId);

    return await Chat.findAll({
      where: { id: chatIds },
      include: [
        {
          model: User,
          where: { id: { [Op.ne]: userId } },
          attributes: ['id', 'firstName', 'lastName', 'role'],
          required: true
        },
        {
          model: Message,
          order: [['createdAt', 'DESC']],
          limit: 1,
        }
      ]
    });
  }

  async findChatBetweenUsers(user1Id, user2Id) {
    const chats = await Chat.findAll({
      include: [{
        model: User,
        through: {
          where: {
            userId: [user1Id, user2Id]
          }
        },
        required: true
      }],
    });
    const filteredChats = chats.filter((el) => {
      const users = el.Users.filter((user) => user.id != user1Id);
      return users === 1;
    });

    return filteredChats[0] || null;
  }

  async getUserDialogs(userId) {
    return await Chat.findAll({
      include: [
        {
          model: User,
          through: {
            where: { userId }
          },
          attributes: [],
          required: true
        },
        {
          model: User,
          as: 'participants',
          through: {
            attributes: []
          },
          where: {
            id: { [Op.ne]: userId }
          }
        },
        {
          model: Message,
          as: 'lastMessage',
          separate: true,
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      ]
    });
  }

  async sendMessage(chatId, senderId, text) {
    return await Message.create({
      chatId,
      senderId,
      text
    });
  }

  async getMessages(chatId, lastMessageId = null) {
    const where = { chatId };
    if (lastMessageId) {
      where.id = { [Op.gt]: lastMessageId };
    }

    return await Message.findAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['createdAt', 'ASC']],
      limit: 50
    });
  }

  async markAsRead(messageIds) {
    return await Message.update(
      { isRead: true },
      { where: { id: messageIds } }
    );
  }
}

export default new ChatService();