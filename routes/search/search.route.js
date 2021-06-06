const express = require('express');
const router = express.Router();
const singersSchema = require('../../models/singer/singer.model');
const albumsSchema = require('../../models/album/album.model');
const songsSchema = require('../../models/song/song.model');

router.post('/', async function (req, res) {
  try {
    const limit = +req.body.limit || 10;
    const stringText = req.body.value;
    const singers = await singersSchema.where({ singer_name: { $regex: '.*' + stringText + '.*' , $options: 'i'} }).limit(limit);
    const albums = await albumsSchema.where({ album_name: { $regex: '.*' + stringText + '.*' , $options: 'i'} }).limit(limit);
    const songs = await songsSchema.where({ song_name: { $regex: '.*' + stringText + '.*' , $options: 'i'} }).limit(limit);
    const results = [];
    singers.forEach(singer => {
      results.push({
        label: singer.singer_name,
        value: singer.singer_name
      })
    });

    albums.forEach(album => {
      results.push({
        label: album.album_name,
        value: album.album_name
      })
    });

    songs.forEach(song => {
      results.push({
        label: song.song_name,
        value: song.song_name
      })
    });

    res.status(200).json({
      searchResults: results
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.post('/result', async function (req, res) {
  try {
    const limit = +req.body.limit || 10;
    const stringText = req.body.value;
    const type = req.body.type;
    let singers;
    // let albums;
    let songs;
    switch (type) {
      case 'tat-ca':
        singers = await singersSchema.where({ singer_name: { $regex: stringText, $options: 'i'} });
        // albums = await albumsSchema.where({ album_name: { $regex: stringText, $options: 'i'} }).limit(limit);
        songs = await songsSchema.where({ "song_singer.singer_name": { $regex: stringText, $options: 'i'} }).limit(limit);
        res.status(200).json({
          singers,
          songs
        });
        return;
      case 'bai-hat':
        singers = await singersSchema.where({ singer_name: { $regex: stringText, $options: 'i'} });
        songs = await songsSchema.where({ "song_singer.singer_name": { $regex: stringText, $options: 'i'} }).limit(limit);
        res.status(200).json({
          songs
        });
        return;
    }
    // const singers = await singersSchema.where({ singer_name: { $regex: stringText, $options: 'i'} }).limit(limit);
    // const albums = await albumsSchema.where({ album_name: { $regex: stringText, $options: 'i'} }).limit(limit);
    // const songs = await songsSchema.where({ song_name: { $regex: stringText, $options: 'i'} }).limit(limit);

    res.status(200).json({
      singers: [],
      albums: [],
      songs: []
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


module.exports = router; 