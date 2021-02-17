const express = require('express');
const router = express.Router();
const singersSchema = require('../../models/singer/singer.model');

router.get('/', async function (req, res) {
  try {
    const singers = await singersSchema.find();
    res.status(200).json({
      singers
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
    const singers = await singersSchema.find().skip(page * limit).limit(limit);
    const count = await singersSchema.countDocuments();
    res.status(200).json({
      singers,
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
    const singer = new singersSchema({
      singer_name: req.body.singer.singer_name,
      created_at: req.body.singer.created_at
    });
    const result = await singer.save();
    res.status(200).json({
      singer: result
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/', async function (req, res) {
  try {
    const singer = await singersSchema.where({ _id: req.body.singer._id }).updateOne({ ...req.body.singer })
    if (singer.ok === 1) {
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
    const _id = req.body.singer._id;
    const result = await singersSchema.deleteOne({ _id });
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