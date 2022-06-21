const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
