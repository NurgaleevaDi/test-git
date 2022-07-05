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
      link: Joi.string().required(),
    }),
  }),
  createCard,
);
router.delete('/:cardId', deleteCard);
router.put('/:cardsId/likes', likeCard);
router.delete('/:cardsId/likes', dislikeCard);

module.exports = router;
