const express = require('express');
const router = express.Router();
const path = require('path');
const { rootPath } = require('../../utils');
const { v1: uuid } = require('uuid');
const songSchema = require('../../models/song/song.model');
const singerSchema = require('../../models/singer/singer.model');
const mm = require('music-metadata');


router.get('/:albumId', async function (req, res) {
  try {
    const { albumId } = req.params;
    const songs = await songSchema.find({ song_id_albums: albumId});
    res.status(200).json({
      songs
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/song/:_id', async function (req, res) {
  try {
    const { _id } = req.params;
    const song = await songSchema.findOne({ _id});
    res.status(200).json({
      song
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/albums/:alBumId', async function (req, res) {
  try {
    const { alBumId } = req.params;
    const song = await songSchema.findOne({ song_id_albums: alBumId});
    res.status(200).json({
      song
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/user/:_id', async function (req, res) {
  try {
    const { _id } = req.params;
    const songs = await songSchema.find({ song_user_id: _id});
    res.status(200).json({
      songs
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/:page/:limit', async function (req, res) {
  try {
    const page = +req.params.page - 1 || 0;
    const limit = +req.params.limit || 10;
    const songs = await songSchema.find().skip(page * limit).limit(limit);
    const count = await songSchema.countDocuments();
    res.status(200).json({
      songs,
      count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.post('/', async function (req, res) {
  try {
    const base64Mp3 = req.body.song.song_url_music.split(";base64,")[1];
    const imageName = uuid();
    const mp3Name = uuid();
    const saveImageUrl = `${path.join(rootPath, 'public/images/song')}\\${imageName}.jpeg`;
    const sageMp3Url = `${path.join(rootPath, 'public/mp3')}\\${mp3Name}.mp3`;

    await require("fs").writeFileSync(sageMp3Url, base64Mp3, 'base64'); // save mp3 file

    const metadata = await mm.parseFile(sageMp3Url); // read metadata
  
    await require("fs").writeFileSync(saveImageUrl, mm.selectCover(metadata.common.picture).data, 'binary'); // save image file

    const singers = [];

    // handle list singer and push into singerModel if not exist
    for (const singer of metadata.common.artist.split(', ')) {
      const s = await singerSchema.findOne({singer_name: singer});

      if (!s || (s &&  Object.keys(s).length <= 0)) {
        const singerResult = await singerSchema.create({
          singer_name: singer,
          created_at: req.body.song.created_at
        });
        singers.push(singerResult);
      } else {
        singers.push(s);
      }
    }

    req.body.song.song_name = metadata.common.title;
    req.body.song.song_singer = singers;
    req.body.song.song_url_image = `static/images/song/${imageName}.jpeg`;
    req.body.song.song_url_music = `static/mp3/${mp3Name}.mp3`;
    req.body.song.song_duration = metadata.format.duration;

    const song = await songSchema.create(req.body.song);
    
    res.status(200).json({
      song
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/', async function (req, res) {
  try {
    const song = await songSchema.where({ _id: req.body.song._id }).updateOne({ ...req.body.song })
    if (song.ok === 1) {
      res.status(200).json({
        status: 'ok'
      });
    }

  } catch (error) {
    res.status(500).json({
      status: 'Server error'
    });
  }
})


router.post('/delete', async function (req, res) {
  try {
    const _id = req.body.song._id;
    const result = await songSchema.deleteOne({ _id });
    if (result.deletedCount >= 1) {
      res.status(200).json({
        status: 'ok'
      });
      return;
    }
    res.status(404).json({
      status: 'fault'
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: 'server error'
    })
  }
})

module.exports = router; 