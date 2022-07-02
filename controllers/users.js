const bcrypt = require('bcrypt');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  MONGO_DUPLICATE_ERROR,
} = require('../errors');
const User = require('../models/users');

const SALT_ROUNDS = 10;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' }));
};
module.exports.getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка ввода данных' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};
module.exports.login = (req, res) => {
  return res.send({messsage: 'login'});
}
module.exports.createUser = (req, res) => {
  // return res.send({ message: 'createUser' });
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или password' });
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
    .then(() => {
      res.send({ message: 'Пользователь создан' });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR) {
        return res.status(409).send({ meaasage: 'Email уже используется' });
      }

      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
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
module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};
