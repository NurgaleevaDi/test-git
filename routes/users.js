const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUsersId,
);
router.get('/me', getUser);
// router.post('', createUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
    }),
  }),
  updateUser,
);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
