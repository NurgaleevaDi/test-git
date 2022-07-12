const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUsersId,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');
const { validateLink } = require('../helpers/validateLink');

router.get('', getUsers);
router.get('/me', getUser);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUsersId,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(validateLink),
    }),
  }),
  updateAvatar,
);

module.exports = router;
