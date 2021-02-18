const express = require('express');
const router = express.Router();
const playListShowSchema = require('../../models/playListShow/playListShow.model');

router.get('/', async function (req, res) {
  try {
    const playListShows = await playListShowSchema.find();
    res.status(200).json({
      playListShows
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
    const playListShows = await playListShowSchema.find().skip(page * limit).limit(limit);
    const count = await playListShowSchema.countDocuments();
    res.status(200).json({
      playListShows,
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
    const playListShow = new playListShowSchema({
      playListShow_name: req.body.playListShow.playListShow_name,
      created_at: req.body.playListShow.created_at
    });
    const result = await playListShow.save();
    res.status(200).json({
      playListShow: result
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/', async function (req, res) {
  try {
    const playListShow = await playListShowSchema.where({ _id: req.body.playListShow._id }).updateOne({ ...req.body.playListShow })
    if (playListShow.ok === 1) {
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
    const _id = req.body.playListShow._id;
    const result = await playListShowSchema.deleteOne({ _id });
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