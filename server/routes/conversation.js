const express = require('express');
let router = express.Router();
const Conversation = require('../controllers/conversation');

router
  .route('/message')
  .post(Conversation.sendMessage)
  .get(Conversation.getMessagesByConvoId);
router.route('/unmatch').delete(Conversation.unmatch);

module.exports = router;
