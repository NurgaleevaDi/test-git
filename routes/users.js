const router = require('express').Router();
// const User = require('../models/users');
const {
  getUsers,
  getUsersId,
  // createUser,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

router.get('', getUsers);
router.get('/:userId', getUsersId);
router.get('/me', getUser);
// router.post('', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
