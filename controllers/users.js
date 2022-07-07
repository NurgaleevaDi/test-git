const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const {
  MONGO_DUPLICATE_ERROR,
} = require('../helpers/errors');
const User = require('../models/users');
const { generateToken } = require('../helpers/jwt');
const ConflictError = require('../errors/conflict-error');
const Unauthorized = require('../errors/unauthorized');

const SALT_ROUNDS = 10;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  console.log('user ', req.user);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};
module.exports.getUsersId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка ввода данных'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или password');
  }
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR) {
        next(new ConflictError('Email уже используется'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Unauthorized('Не передан email или password');
  }
  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Не передан email или password');
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new Unauthorized('Не передан email или password');
      }
      return generateToken({ _id: user._id });
      // return generateToken({ email: user.email });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 403) {
        next(new ForbiddenError('Необходимо авторизоваться'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      next(err);
    });
};
module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      next(err);
    });
};
