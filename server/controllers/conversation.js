const Conversation = require('../models/conversation');
const User = require('../models/user');

exports.sendMessage = async (req, res) => {
  try {
    let data = req.body;
    const message = await Conversation.createMessage(data);
    if (message.success) {
      const pushMessage = await Conversation.addMessage(
        message.message.id,
        data.conversationId
      );
      if (pushMessage.success) {
        return res.status(200).json({
          message: message.message,
          conversation: pushMessage.pushMessage,
        });
      } else {
        return res.status(400).json({ message: 'error adding message' });
      }
    } else {
      return res.status(400).json({ message: 'error creating message' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error sending message', error: error });
  }
};

exports.unmatch = async (req, res) => {
  try {
    let data = req.body;
    const conversation = await Conversation.unmatch(data);
    if (conversation.success) {
      console.log(conversation);
      let convoId = conversation.conversation.id;
      let user1 = conversation.conversation.user1;
      let user2 = conversation.conversation.user2;
      const editUser1 = await User.unmatch(convoId, user1);
      if (editUser1.success) {
        const edituser2 = await User.unmatch(convoId, user2);
        if (edituser2.success) {
          return res
            .status(200)
            .json({ conversation: conversation.conversation });
        } else {
          return res.status(400).json({ message: 'error w user 2' });
        }
      } else {
        return res.status(400).json({ message: 'error w user 1' });
      }
    } else {
      return res.status(400).json({ message: 'Error unmatching' });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error deleting conversation', error: error });
  }
};

exports.getMessagesByConvoId = async (req, res) => {
  try {
    let data = req.body;
    const messages = await Conversation.fetchMsgsByConvoId(data);
    if (messages.success) {
      return res.status(200).json({ messages: messages.messages });
    } else {
      return res.status(400).json({ message: 'error getting msgs' });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Error getting messages' });
  }
};
