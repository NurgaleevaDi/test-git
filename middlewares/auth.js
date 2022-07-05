const User = require('../models/users');
const { checkToken } = require('../helpers/jwt');
const { ERROR_UNAUTHORIZED } = require('../errors');

const throwUnathorizedError = () => {
  const error = new Error('Авторизуйтесь');
  error.statusCode = ERROR_UNAUTHORIZED;
  throw error;
};
const auth = (req, res, next) => {
  const isAutorized = req.headers.authorization;
  if (!isAutorized) {
    throwUnathorizedError();
  }

  const token = isAutorized.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    User.findOne({ email: payload.email })
      .then((user) => {
        if (!user) {
          throwUnathorizedError();
        }
        req.user = { id: user.id };
        next();
      });
    // .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
  } catch (err) {
    throwUnathorizedError();
  }
};

module.exports = { auth };
