const express = require('express');
let router = express.Router();
const Prompt = require('../controllers/prompt');

router.route('/').post(Prompt.createPrompt);
router
  .route('/:id')
  .patch(Prompt.updatePrompt)
  .get(Prompt.fetchById)
  .delete(Prompt.deletePrompt);

module.exports = router;
