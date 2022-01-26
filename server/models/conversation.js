const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  userId: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  conversationId: { type: String, required: true },
});

const conversationSchema = mongoose.Schema({
  user1: { type: String, required: true, trim: true },
  user2: { type: String, required: true, trim: true },
  messageIds: { type: [String], trim: true },
});

const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = {
  Conversation,
  Message,
  create: async (userId, likedUserId) => {
    let success = false;
    try {
      let conversation = new Conversation({
        user1: userId,
        user2: likedUserId,
      });

      const doc = await conversation.save();
      if (doc) {
        success = true;
      }
      return { conversation, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  createMessage: async (data) => {
    let success = false;
    try {
      let message = new Message({
        userId: data.userId,
        content: data.content,
        conversationId: data.conversationId,
      });

      const doc = await message.save();
      if (doc) {
        success = true;
      }
      return { message, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  addMessage: async (messageId, conversationId) => {
    let success = false;
    console.log(messageId);
    try {
      let pushMessage = await Conversation.findOneAndUpdate(
        { _id: conversationId },
        { $push: { messageIds: messageId } },
        { new: true }
      );
      if (pushMessage) {
        success = true;
      }
      return { pushMessage, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  fetchMsgsByConvoId: async (data) => {
    let success = false;
    try {
      let messages = await Message.find({
        conversationId: data.conversationId,
      });
      if (messages) {
        success = true;
      }
      return { messages, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  unmatch: async (data) => {
    let success = false;
    try {
      let conversation = await Conversation.findOneAndDelete({
        _id: data.conversationId,
      });
      if (conversation) {
        success = true;
      }
      return { conversation, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
};
