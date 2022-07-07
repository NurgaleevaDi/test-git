const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
// const isURL = require('validator/lib/isURL');
const regex = /^(http|https):\/\/([\w_-]+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;
// const regex = /(https?:\/\/)(w{3}\.)
// ?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com|net)))(:\d{2,5})?((\/.+)+)?\/?#?/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Необходимо ввести имя'],
    minlength: [2, 'Должно быть не менее 2 символов'],
    maxlength: [30, 'Должно быть не более 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    // required: [true, 'Необходимо ввести описание'],
    minlength: [2, 'Должно быть не менее 2 символов'],
    maxlength: [30, 'Должно быть не более 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // required: [true, 'Необходимо ввести ссылку на аватар'],
    validate: {
      validator: (v) => regex.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

module.exports = mongoose.model('user', userSchema);
