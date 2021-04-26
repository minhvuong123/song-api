const express = require('express');
const app = express();
const PORT = 4000;

const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '100mb'}));
app.use('/static', express.static('public'));

// routes
const users = require('./routes/user/user.route');
const songs = require('./routes/song/song.route');
const albums = require('./routes/album/album.route');
const categories = require('./routes/category/category.route');
const singers = require('./routes/singer/singer.route');
const countries = require('./routes/country/country.route');
const albumList = require('./routes/albumList/albumList.route');

app.use('/users', users);
app.use('/songs', songs);
app.use('/albums', albums);
app.use('/categories', categories);
app.use('/singers', singers);
app.use('/countries', countries);
app.use('/albumList', albumList);

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