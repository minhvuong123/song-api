const express = require('express');
const router = express.Router();
const path = require('path');
const { rootPath } = require('../../utils');
const { v1: uuid } = require('uuid');
const songSchema = require('../../models/song/song.model');
const countrySchema = require('../../models/country/country.model');
const singerSchema = require('../../models/singer/singer.model');

router.get('/', async function (req, res) {
  try {
    const songs = await songSchema.find();
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

    const base64Image = req.body.song.song_url_image.split(";base64,")[1];
    const base64Mp3 = req.body.song.song_url_music.split(";base64,")[1];
    const extenImage = req.body.imageType;
    const extenMp3 = req.body.mp3Type === 'mpeg' ? 'mp3' : 'mp3';
    const imageName = uuid();
    const mp3Name = uuid();
    const saveImageUrl = `${path.join(rootPath, 'public/images')}\\${imageName}.${extenImage}`;
    const sageMp3Url = `${path.join(rootPath, 'public/mp3')}\\${mp3Name}.${extenMp3}`;

    // convert data
    const country = await countrySchema.where({ _id: req.body.song.song_country });
    const singers = await singerSchema.find({_id: {"$in": req.body.song.song_singer}});

    req.body.song.song_country = country[0];
    req.body.song.song_singer = singers;
    req.body.song.song_url_image = base64Image ? `static/images/${imageName}.${extenImage}` : '';
    req.body.song.song_url_music = base64Mp3 ? `static/mp3/${mp3Name}.${extenMp3}` : '';

    const { 
      song_name, 
      song_singer, 
      song_country,
      song_url_image, 
      song_url_music, 
      song_id_playlist = '', 
      created_at 
    } = req.body.song;

    await require("fs").writeFileSync(saveImageUrl, base64Image, 'base64');
    
    await require("fs").writeFileSync(sageMp3Url, base64Mp3, 'base64');

    const song = new songSchema({ 
      song_name, 
      song_singer, 
      song_country,
      song_url_image, 
      song_url_music, 
      song_id_playlist: '', 
      created_at 
    });

    const result = await song.save();
    
    res.status(200).json({
      song: result
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