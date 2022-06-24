const router = require('express').Router();
// const Card = require('../models/cards');
const {
  getCards,
  createCard,
  deleteCard,
  // likeCard,
  // dislikeCard,
} = require('../controllers/cards');

router.get('', getCards);
router.post('', createCard);
router.delete('/:cardId', deleteCard);
// router.put('/:cardsId/likes', likeCard);
// router.delete('/:cardsId/likes', dislikeCard);

module.exports = router;
