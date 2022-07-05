const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const {
  ERROR_NOT_FOUND,
  ERROR_BAD_REQUEST,
  ERROR_SERVER,
} = require('../errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({
    name, link, owner,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Ошибка валидации: ${err}`));
        return;
      }
      next(err);
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else if (String(card.owner) !== String(req.user.id)) {
        throw new ForbiddenError('Нельзя удалять чужую карточку');
      } else {
        card.remove()
          .then(() => res.send({ card }));
      }
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
        // res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        // return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка ввода данных'));
        return;
        // return res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка ввода данных' });
      }
      next(err);
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw NotFoundError('Карточка не найдена');
        // res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        // return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка ввода данных'));
        return;
        // return res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка ввода данных' });
      }
      next(err);
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};
