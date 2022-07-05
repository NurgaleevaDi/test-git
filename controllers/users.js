const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_CONFLICT,
  ERROR_SERVER,
  MONGO_DUPLICATE_ERROR,
  ERROR_FORBIDDEN,
} = require('../errors');
const User = require('../models/users');
const { generateToken } = require('../helpers/jwt');
const ConflictError = require('../errors/conflict-error');
const Unauthorized = require('../errors/unauthorized');

const SALT_ROUNDS = 10;

module.exports.getUsers = (req, res, next) => {
  // console.log('ID: ', req.user.id);
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  // console.log('User');
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch(next);
};
module.exports.getUsersId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
        // res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        // return;
      }
      // console.log(user);
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
        // return res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка ввода данных' });
      }
      next(err);
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
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
    // const error = new Error('Не передан email или password');
    // error.statusCode = ERROR_BAD_REQUEST;
    // throw error;
    // return res.status(400).send({ message: 'Не передан email или password' });
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
        // const error = new Error('Email уже используется');
        // error.statusCode = ERROR_CONFLICT;
        // throw error;
        next(new ConflictError('Email уже используется'));
        return;
        // return res.status(ERROR_CONFLICT).send({ meaasage: 'Email уже используется' });
      }
      // throw err;
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
      next(err);
    });

  // User.create({
  //   name, about, avatar, email, password,
  // })
  //   .then((user) => res.send({ data: user }))
  //   .catch((err) => {
  //     if (err.name === 'ValidationError') {
  //       return res.status(ERROR_BAD_REQUEST).send({ message: `Ошибка ${err}` });
  //     }
  //     return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
  //   });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Unauthorized('Не передан email или password');
    // return res.status(400).send({ message: 'Не передан email или password' });
  }
  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Не передан email или password');
        // const err = new Error('Неправильный email или password');
        // err.statusCode = ERROR_FORBIDDEN;
        // throw err;
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new Unauthorized('Не передан email или password');
        // const err = new Error('Неправильный email или password');
        // err.statusCode = ERROR_FORBIDDEN;
        // throw err;
      }
      return generateToken({ email: user.email });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 403) {
        next(new ForbiddenError('Необходимо авторизоваться'))
        // return res.status(403).send({ message: err.message });
      }
      next(err);
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        // return res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      }
      next(err);
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        // return res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      }
      next(err);
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};
