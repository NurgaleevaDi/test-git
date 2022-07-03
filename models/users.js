const mongoose = require('mongoose');

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
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
