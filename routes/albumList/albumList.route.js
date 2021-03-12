const express = require('express');
const router = express.Router();
const { removeAccents } = require('../../utils');
const albumListSchema = require('../../models/albumList/albumList.model');

router.get('/', async function (req, res) {
  try {
    const albumList = await albumListSchema.find();
    res.status(200).json({
      albumList
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/status/:status', async function (req, res) {
  try {
    const albumList = await albumListSchema.find({albumList_status: req.params.status});
    res.status(200).json({
      albumList
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
    const albumList = await albumListSchema.find().skip(page * limit).limit(limit);
    const count = await albumListSchema.countDocuments();
    res.status(200).json({
      albumList,
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
    const convertString = removeAccents(req.body.albumList.albumList_name).replace(/ /g, '-');
    const albumList = new albumListSchema({
      albumList_name: req.body.albumList.albumList_name,
      albumList_slug: convertString,
      created_at: req.body.albumList.created_at
    });
    const result = await albumList.save();
    res.status(200).json({
      albumList: result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/status', async function (req, res) {
  try {
    // const albumList = await albumListSchema.where({ _id: req.body.albumList._id }).updateOne({ ...req.body.albumList })
    for (const album of req.body.albums) {
      await albumListSchema.where({ _id: album._id }).updateOne({ albumList_status: album.albumList_status})
    }
  
    res.status(200).json({
      status: 'ok'
    });
  } catch (error) {
    res.status(500).json({
      status: 'Server error'
    });
  }
})


router.post('/delete', async function (req, res) {
  try {
    const _id = req.body.albumList._id;
    const result = await albumListSchema.deleteOne({ _id });
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