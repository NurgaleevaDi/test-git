const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_NOT_FOUND } = require('./errors');

const app = express();
const PORT = 3000;
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62b2886c4145914626b0fe40',
//   };

//   next();
// });

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемая страница не существует' });
});
// централизованная обработка ошибок
/* eslint-disable-next-line */
app.use((err, req, res, next) => {
  console.log('ERROR: ', err.statusCode);
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App started and listen port', PORT);
});
