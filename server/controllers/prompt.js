const Prompt = require('../models/prompt');

exports.createPrompt = async (req, res) => {
  try {
    let data = req.body;
    const prompt = await Prompt.create(data);
    if (prompt.success) {
      return res.status(200).json({ prompt: prompt.prompt });
    } else {
      return res.status(400).json({ message: 'Failed to create prompt' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating prompt', error: error });
  }
};

exports.updatePrompt = async (req, res) => {
  try {
    let data = req.body;
    let id = req.params;
    const prompt = await Prompt.update(data, id);
    if (prompt.success) {
      return res.status(200).json({ prompt: prompt.prompt });
    } else {
      return res.status(400).json({ message: 'Failed to update prompt' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating prompt', error: error });
  }
};

exports.fetchById = async (req, res) => {
  try {
    let id = req.params.id;
    const prompt = await Prompt.getById(id);
    if (prompt.success) {
      return res.status(200).json({ prompt: prompt.prompt });
    } else {
      return res.status(400).json({ message: 'Failed to find prompt' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error finding prompt', error: error });
  }
};

exports.deletePrompt = async (req, res) => {
  try {
    let id = req.params.id;
    const prompt = await Prompt.deleteById(id);
    if (prompt.success) {
      return res.status(200).json({ prompt: prompt.prompt });
    } else {
      return res.status(400).json({ message: 'Failed to delete prompt' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error deleting prompt', error: error });
  }
};
