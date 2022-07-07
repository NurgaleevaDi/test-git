const mongoose = require('mongoose');

const { regex } = require('../helpers/validateLink');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    // required: [true, 'Необходимо ввести название'],
    // minlength: [2, 'Должно быть не менее 2 символов'],
    // maxlength: [30, 'Должно быть не более 30 символов'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regex.test(v),
      message: 'Неправильный формат ссылки',
    },
    // required: [true, 'Необходимо ввести ссылку'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Необходим id'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
