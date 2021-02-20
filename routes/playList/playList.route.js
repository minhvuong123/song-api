const express = require('express');
const router = express.Router();
const path = require('path');
const { rootPath, removeAccents } = require('../../utils');
const { v1: uuid } = require('uuid');
const playListSchema = require('../../models/playList/playList.model');
const categorySchema = require('../../models/category/category.model');
const countrySchema = require('../../models/country/country.model');
const playListShowSchema = require('../../models/playListShow/playListShow.model');

router.get('/', async function (req, res) {
  try {
    const playLists = await playListSchema.find();
    // const playListShow = await playListShowSchema.find();
    // const playLists = await playListSchema.find({"playList_listShow._id": playListShow[0]._id});

    res.status(200).json({
      playLists
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/:name', async function (req, res) {
  try {
    const { name } = req.params;
    const playList = await playListSchema.findOne({ playList_slug: name });

    res.status(200).json({
      playList
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

    const base64Image = req.body.playList.playList_url_image.split(";base64,")[1];
    const extenImage = req.body.imageType;
    const imageName = uuid();
    const saveImageUrl = `${path.join(rootPath, 'public/images/playList')}\\${imageName}.${extenImage}`;


    // convert data
    const category = await categorySchema.where({ _id: req.body.playList.playList_category });
    const country = await countrySchema.where({ _id: req.body.playList.playList_country });
    const playListShow = await playListShowSchema.where({ _id: req.body.playList.playList_listShow });
    console.log("1");
    req.body.playList.playList_listShow = playListShow[0];
    req.body.playList.playList_category = category[0];
    req.body.playList.playList_country = country[0];
    req.body.playList.playList_url_image = base64Image ? `static/images/playList/${imageName}.${extenImage}` : '';

    const convertString = removeAccents(req.body.playList.playList_name).replace(/ /g, '-');

    const {
      playList_name,
      playList_category,
      playList_listShow,
      playList_url_image,
      playList_country,
      created_at
    } = req.body.playList;

    if (playList_url_image) {
      await require("fs").writeFileSync(saveImageUrl, base64Image, 'base64');
    }

    const playList = new playListSchema({
      playList_name,
      playList_slug: convertString,
      playList_category,
      playList_listShow,
      playList_url_image,
      playList_country,
      created_at
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