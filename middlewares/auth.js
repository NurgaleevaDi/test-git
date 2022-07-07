const User = require('../models/users');
const { checkToken } = require('../helpers/jwt');
const { ERROR_UNAUTHORIZED } = require('../helpers/errors');

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
  let payload; // +
  try {
    payload = checkToken(token);
    // const payload = checkToken(token);
    console.log('payload: ', payload);
    // User.findOne({ email: payload.email })
    //   .then((user) => {
    //     if (!user) {
    //       throwUnathorizedError();
    //     }
    //     req.user = payload;
    //     // req.user = { id: user.id };
    //     next();
    //   });
  } catch (err) {
    throwUnathorizedError();
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
