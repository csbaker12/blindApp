const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const responseSchema = mongoose.Schema({
  promptId: { type: String, required: true, trim: true },
  response: { type: String, required: true },
  userId: { type: String, required: true },
});

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email Address');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['client', 'admin', 'superAdmin'],
    default: 'client',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'intersexual'],
    default: 'intersexual',
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  matches: { type: [String] },
  likedBy: { type: [String] },
  dislikes: { type: [String] },
  interests: { type: [String] },
  age: { type: Number, required: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  conversations: { type: [String] },
  responses: { type: [String] },
});

const User = mongoose.model('User', userSchema);
const Response = mongoose.model('Response', responseSchema);

module.exports = {
  User,
  Response,
  create: async (data) => {
    let success = false;

    try {
      //check if email taken
      let email = await User.findOne({ email: data.email });
      if (email) {
        console.log('email taken');
        return { success: false };
      }
      //salt pass
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(data.password, salt);
      data.password = hash;
      //create user
      let user = new User({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        gender: data.gender,
        phone: data.phone,
        age: data.age,
        city: data.city,
        state: data.state,
      });

      console.log(user);

      const doc = await user.save();
      if (doc) {
        success = true;
      }
      //generate token

      const userObj = {
        email: data.email,
        id: user._id.toHexString(),
      };
      const token = jwt.sign(userObj, process.env.DB_SECRET, {
        expiresIn: '10d',
      });

      console.log(token);
      //send email

      //   const emailObj = {
      //     id: user._id.toHexString(),
      //   };
      //   const emailToken = jwt.sign(emailObj, process.env.DB_SECRET, {
      //     expiresIn: '100d',
      //   });

      //   await registerEmail(data.email, emailToken);

      return {
        user,
        success,
        token,
        // emailToken,
      };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  getByEmail: async (email) => {
    let success = false;
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        success = true;
      }
      return { user, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  signIn: async (data) => {
    let success = false;
    try {
      let user = await User.findOne({ email: data.email });
      if (!user) {
        console.log('bad email');
        return { success: false };
      }
      const match = await bcrypt.compare(data.password, user.password);
      if (!match) {
        console.log('bad password');
        return { success: false };
      }
      const userObj = {
        email: user.email,
        username: user.username,
        _id: user._id.toHexString(),
      };
      const token = jwt.sign(userObj, process.env.DB_SECRET, {
        expiresIn: '10d',
      });

      success = true;

      return {
        user,
        success,
        token,
      };
    } catch (error) {
      console.log('error signin in user');
      return { success: false };
    }
  },
  findAll: async () => {
    let success = false;
    try {
      let users = await User.find();
      if (users) {
        success = true;
      }
      return { users, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  updateProfile: async (id, data) => {
    let success = false;
    try {
      let user = await User.findOneAndUpdate(
        { _id: id.id },
        {
          $set: {
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            age: data.age,
            city: data.city,
            state: data.state,
          },
        },
        { new: true }
      );
      if (user) {
        success = true;
      }
      return { user, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  deleteAccount: async (id) => {
    let success = false;
    try {
      let user = await User.findOneAndDelete({ _id: id.id });
      if (user) {
        success = true;
      }
      return { success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  checkMatch: async (userId, likedUserId) => {
    let success = false;
    try {
      let user = await User.findById({ _id: userId });
      for (let i = 0; i < user.likedBy.length; i++) {
        if (user.likedBy[i] === likedUserId) {
          let addMatch = await User.findOneAndUpdate(
            { _id: userId },
            { $push: { matches: likedUserId } },
            { new: true }
          );
          let matchedUser = await User.findOneAndUpdate(
            { _id: likedUserId },
            {
              $push: {
                matches: userId,
              },
            },
            { new: true }
          );
          if ((matchedUser, addMatch)) {
            success = true;
            return { success, matchedUser };
          }
        }
      }

      return { success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  addLike: async (userId, likedUserId) => {
    let success = false;
    try {
      let user = await User.findOneAndUpdate(
        { _id: likedUserId },
        { $push: { likedBy: userId } },
        { new: true }
      );
      if (user) {
        success = true;
      }
      return { success, user };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  addDislike: async (data) => {
    let success = false;
    try {
      let user = await User.findOneAndUpdate(
        { _id: data.userId },
        { $push: { dislikes: data.dislikedUserId } },
        { new: true }
      );
      if (user) {
        success = true;
      }
      return { user, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  addInterest: async (data) => {
    let success = false;
    try {
      let user = await User.findOneAndUpdate(
        { _id: data.userId },
        { $push: { interests: data.interests } },
        { new: true }
      );
      if (user) {
        success = true;
      }
      return { user, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  updateInterests: async (data) => {
    let success = false;
    try {
      let user = await User.findOneAndUpdate(
        { _id: data.userId },
        { $set: { interests: data.interests } },
        { new: true }
      );
      if (user) {
        success = true;
      }
      return { user, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  getById: async (id) => {
    let success = false;
    try {
      let user = await User.findById({ _id: id });
      if (user) {
        success = true;
      }
      return { user, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  addConvo: async (userId, likedUserId, convoId) => {
    let success = false;
    try {
      let user1 = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { conversations: convoId } },
        { new: true }
      );

      let user2 = await User.findOneAndUpdate(
        { _id: likedUserId },
        { $push: { conversations: convoId } },
        { new: true }
      );
      if (user2 && user1) {
        success = true;
      }

      return { user1, user2, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  addResponse: async (data) => {
    let success = false;
    try {
      let response = new Response({
        promptId: data.promptId,
        response: data.response,
        userId: data.userId,
      });
      const doc = await response.save();
      if (doc) {
        let user = await User.findOneAndUpdate(
          { _id: data.userId },
          { $push: { responses: doc._id } },
          { new: true }
        );
        if (user) {
          success = true;
        }
      }
      return { response, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  updateResponse: async (data) => {
    let success = false;
    try {
      let response = await Response.findOneAndUpdate(
        { _id: data.id },
        {
          $set: {
            response: data.response,
          },
        },
        { new: true }
      );
      if (response) {
        success = true;
      }
      return { response, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  deleteResponse: async (data) => {
    let success = false;
    try {
      let user = await User.findById({ _id: data.userId });
      if (user) {
        let responses = user.responses;
        const result = responses.filter(
          (response) => response != data.responseId
        );
        let filteredUser = await User.findOneAndUpdate(
          { _id: data.userId },
          { $set: { responses: result } },
          { new: true }
        );
        if (filteredUser) {
          let response = await Response.findOneAndDelete({
            _id: data.responseId,
          });
          if (response) {
            success = true;
          }
        }
      }
      return { user, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  fetchAllResponses: async (data) => {
    let success = false;
    console.log(data.userId);
    try {
      let responses = await Response.find({ userId: data.userId });
      if (responses) {
        success = true;
      }
      return { responses, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  unmatch: async (convoId, userId) => {
    let success = false;
    try {
      let patchedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { conversations: convoId } },
        { new: true }
      );
      if (patchedUser) {
        success = true;
      }
      return { patchedUser, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
};
