const User = require('../models/users');
const { checkToken } = require('../helpers/jwt');

const auth = (req, res, next) => {
  const isAutorized = req.headers.authorization;
  if (!isAutorized) {
    return res.status(401).send({ message: 'Авторизуйтесь' });
  }

  const token = isAutorized.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    User.findOne({ email: payload.email })
      .then((user) => {
        if (!user) {
          return res.status(401).send({ message: 'Авторизуйтесь' });
        }
        req.user = { id: user.id };
        next();
      })
      .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
  } catch (err) {
    return res.status(401).send({ message: 'Авторизуйтесь' });
  }
};

module.exports = { auth };
