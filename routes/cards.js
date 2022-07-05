const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const Card = require('../models/cards');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('', getCards);
router.post(
  '',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
    }),
  }),
  createCard,
);
router.delete('/:cardId', deleteCard);
router.put('/:cardsId/likes', likeCard);
router.delete('/:cardsId/likes', dislikeCard);

module.exports = router;
