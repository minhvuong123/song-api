const express = require('express');
const router = express.Router();
const songSchema = require('../../models/song/song.model');

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
    const song = new songSchema({
      song_name: req.body.song.song_name,
      song_singer: req.body.song.song_singer,
      song_url: req.body.song.song_url,
      song_id_playlist: req.body.song.song_id_playlist,
      created_at: req.body.song.created_at
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