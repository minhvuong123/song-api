const express = require('express');
const router = express.Router();
const playListSchema = require('../../models/playList/playList.model');

router.get('/', async function (req, res) {
  try {
    const playLists = await playListSchema.find();
    res.status(200).json({
      playLists
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
    const playLists = await playListSchema.find().skip(page * limit).limit(limit);
    const count = await playListSchema.countDocuments();
    res.status(200).json({
      playLists,
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
    const playList = new playListSchema({
      playList_name: req.body.playList.playList_name,
      playList_type: req.body.playList.playList_type,
      created_at: req.body.playList.created_at
    });
    const result = await playList.save();
    res.status(200).json({
      playList: result
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/', async function (req, res) {
  try {
    const playList = await playListSchema.where({ _id: req.body.playList._id }).updateOne({ ...req.body.playList })
    if (playList.ok === 1) {
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
    const _id = req.body.playList._id;
    const result = await playListSchema.deleteOne({ _id });
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