const express = require('express');
let router = express.Router();
const User = require('../controllers/user');

router.route('/').post(User.createUser).get(User.getAllUsers);
router
  .route('/profile/:id')
  .patch(User.updateProfile)
  .delete(User.deleteUser)
  .get(User.fetchById);
router.route('/addLike').post(User.addLike);
router.route('/addDislike').post(User.addDislike);
router.route('/interests').post(User.addInterest).patch(User.updateInterests);
router
  .route('/prompt')
  .post(User.addPromptResponse)
  .patch(User.updatePromptResponse)
  .delete(User.deletePromptResponse)
  .get(User.fetchResponsesById);
router.route('/signin').post(User.signIn);

module.exports = router;
