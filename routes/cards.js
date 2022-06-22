const router = require('express').Router();
const Card = require('../models/cards');
const { getCards, createCard, deleteCard } = require('../controllers/users');

router.get('', getCards);
router.post('', createCard);
router.delete('/:cardId', deleteCard);

module.exports = router;
