const express = require('express');
const app = express();
const PORT = 4000;

const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '10mb'}));
app.use('/static', express.static('public'));

// routes
const users = require('./routes/user/user.route');
const songs = require('./routes/song/song.route');
const playLists = require('./routes/playList/playList.route');
const categories = require('./routes/category/category.route');
const singers = require('./routes/singer/singer.route');
const countries = require('./routes/country/country.route');

app.use('/users', users);
app.use('/songs', songs);
app.use('/playLists', playLists);
app.use('/categories', categories);
app.use('/singers', singers);
app.use('/countries', countries);

mongoose.connect('mongodb://localhost/songApp', { useNewUrlParser: true, useUnifiedTopology: true });
const connect = mongoose.connection;
connect.on('error', function(){
  console.log('Mongodb connect to fail !');
});
connect.on('open', function(){
  console.log('Mongodb connected...');
});

app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
})