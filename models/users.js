const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Необходимо ввести имя'],
    minlength: [2, 'Должно быть не менее 2 символов'],
    maxlength: [30, 'Должно быть не более 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Необходимо ввести описание'],
    minlength: [2, 'Должно быть не менее 2 символов'],
    maxlength: [30, 'Должно быть не более 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Необходимо ввести ссылку на аватар'],
  },
});

module.exports = mongoose.model('user', userSchema);
