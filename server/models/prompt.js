const mongoose = require('mongoose');

const promptSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = {
  Prompt,
  create: async (data) => {
    let success = false;
    try {
      let prompt = new Prompt({
        question: data.question,
      });

      const doc = await prompt.save();
      if (doc) {
        success = true;
      }
      return { prompt, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  update: async (data, id) => {
    let success = false;
    try {
      let prompt = await Prompt.findOneAndUpdate(
        { _id: id.id },
        { $set: { question: data.question } },
        { new: true }
      );
      if (prompt) {
        success = true;
      }
      return { prompt, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  getById: async (id) => {
    let success = false;
    try {
      let prompt = await Prompt.findById({ _id: id });
      if (prompt) {
        success = true;
      }
      return { prompt, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  deleteById: async (id) => {
    let success = false;
    try {
      let prompt = await Prompt.findByIdAndRemove({ _id: id });
      if (prompt) {
        success = true;
      }
      return { prompt, success };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
};
