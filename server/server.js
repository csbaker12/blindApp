require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/user');
const prompts = require('./routes/prompt');
const conversations = require('./routes/conversation');

const app = express();

app.use(bodyParser.json());
app.use('/user', users);
app.use('/prompt', prompts);
app.use('/conversation', conversations);

const mongoUri =
  'mongodb+srv://admin123:Testing123@cluster0.m5j2q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(mongoUri);

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo', err);
});

app.listen(3001, () => {
  console.log('listening on port 3001');
});
