const User = require('../models/user');
const Conversation = require('../models/conversation');

exports.createUser = async (req, res) => {
  try {
    let data = req.body;
    const user = await User.create(data);
    if (user.success) {
      return res.status(200).json({ user: user.user, token: user.token });
    } else {
      return res.status(400).json({ message: 'Failed to create user' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error });
  }
};

exports.signIn = async (req, res) => {
  try {
    let data = req.body;
    let user = await User.signIn(data);
    console.log(user);
    if (user.success) {
      return res.status(200).json({ user: user.user, token: user.token });
    } else {
      return res.status(400).json({
        message: 'User sign in failed',
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Failed to sign in the user', error: error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.success) {
      return res.status(200).json({ users: users.users });
    } else {
      return res
        .status(400)
        .json({ message: 'Error fetching users', error: error });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error fetching all users', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let id = req.params;
    let data = req.body;
    const user = await User.updateProfile(id, data);
    if (user.success) {
      return res.status(200).json({ user: user.user });
    } else {
      return res.status(400).json({ message: 'Error updating this user' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let id = req.params;
    const user = await User.deleteAccount(id);
    if (user.success) {
      return res.status(200).json({ message: 'Deleted User' });
    } else {
      return res.status(400).json({ message: 'could not delete user' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error: error });
  }
};

exports.addLike = async (req, res) => {
  try {
    //check if they already have a like from this user
    let userId = req.body.userId;
    let likedUserId = req.body.likedUserId;
    const isMatch = await User.checkMatch(userId, likedUserId);
    if (isMatch.success) {
      const convo = await Conversation.create(userId, likedUserId);
      if (convo.success) {
        const user = await User.addConvo(
          userId,
          likedUserId,
          convo.conversation.id
        );
        if (user.success) {
          return res.status(200).json({
            message: `${user.user1.firstName} and ${user.user2.firstName} have matched`,
          });
        } else {
          return res.status(400).json({ message: 'error adding user convo' });
        }
      } else {
        return res.status(400).json({ message: 'error creating convo' });
      }
    } else {
      //if not a match add like to the other users array
      const likedUser = await User.addLike(userId, likedUserId);
      if (likedUser.success) {
        return res
          .status(200)
          .json({ message: `${userId} likes ${likedUserId}` });
      }
    }

    res.send({ message: `${userId}` });
  } catch (error) {
    res.status(400).json({ message: 'Error adding like', error: error });
  }
};

exports.addDislike = async (req, res) => {
  try {
    let data = req.body;
    const updateUser = await User.addDislike(data);
    if (updateUser.success) {
      return res.status(200).json({ message: 'user disliked' });
    } else {
      return res.status(400).json({ message: 'dislike unsuccessful' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error adding dislike', error: error });
  }
};

exports.addInterest = async (req, res) => {
  try {
    let data = req.body;
    const updatedUser = await User.addInterest(data);
    if (updatedUser.success) {
      return res.status(200).json({ user: updatedUser.user });
    } else {
      return restart.status(400).json({ message: 'Error adding the interest' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error adding interest', error: error });
  }
};

exports.updateInterests = async (req, res) => {
  try {
    let data = req.body;
    const updatedUser = await User.updateInterests(data);
    if (updatedUser.success) {
      return res.status(200).json({ user: updatedUser.user });
    } else {
      return res.status(400).json({ message: 'Error updating the interests' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating interests', error: error });
  }
};

exports.fetchById = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.getById(id);
    if (user.success) {
      return res.status(200).json({ user: user.user });
    } else {
      return res.status(400).json({ message: 'Failed to find user' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error finding user', error: error });
  }
};

exports.addPromptResponse = async (req, res) => {
  try {
    let data = req.body;
    const response = await User.addResponse(data);
    if (response.success) {
      return res.status(200).json({ response: response.response });
    } else {
      return res
        .status(400)
        .json({ message: 'Error adding response to prompt' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error adding response', error: error });
  }
};

exports.updatePromptResponse = async (req, res) => {
  try {
    let data = req.body;
    const response = await User.updateResponse(data);
    if (response.success) {
      return res.status(200).json({ response: response.response });
    } else {
      return res.status(400).json({ message: 'Error updating response' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error changing response', error: error });
  }
};

exports.deletePromptResponse = async (req, res) => {
  try {
    let data = req.body;
    const response = await User.deleteResponse(data);
    if (response.success) {
      return res.status(200).json({ message: 'Response deleted' });
    } else {
      return res.status(400).json({ message: 'Error deleting response' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error deleting response', error: error });
  }
};

exports.fetchResponsesById = async (req, res) => {
  try {
    let data = req.body;
    const responses = await User.fetchAllResponses(data);
    if (responses.success) {
      return res.status(200).json({ responses: responses.responses });
    } else {
      return res.status(400).json({ message: 'Error fetching responses' });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error fetching responses yo', error: error });
  }
};
