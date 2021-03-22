const express = require('express');
const router = express.Router();
const path = require('path');
const { rootPath, removeAccents } = require('../../utils');
const { v1: uuid } = require('uuid');
const albumSchema = require('../../models/album/album.model');
const categorySchema = require('../../models/category/category.model');
const countrySchema = require('../../models/country/country.model');
const albumshowSchema = require('../../models/albumList/albumList.model');

router.get('/', async function (req, res) {
  try {
    const albums = await albumSchema.find();
    // const albumshow = await albumshowSchema.find();
    // const albums = await albumSchema.find({"album_listShow._id": albumshow[0]._id});

    res.status(200).json({
      albums
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/:_id', async function (req, res) {
  try {
    const { _id } = req.params;
    const album = await albumSchema.findOne({ _id });

    res.status(200).json({
      album
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
    const albums = await albumSchema.find({ album_user_id: _id });

    res.status(200).json({
      albums
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/albumlist/:_id', async function (req, res) {
  try {
    const { _id } = req.params;
    const albums = await albumSchema.find({"album_listShow._id": _id});

    res.status(200).json({
      albums
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/category/:_id', async function (req, res) {
  try {
    const { _id } = req.params;
    const albums = await albumSchema.find({"album_category._id": _id});

    res.status(200).json({
      albums
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/category/:_id/:limit', async function (req, res) {
  try {
    const { _id, limit } = req.params;
    const albums = await albumSchema.find({"album_category._id": _id}).limit(+limit || 5);

    res.status(200).json({
      albums
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
    const albums = await albumSchema.find().skip(page * limit).limit(limit);
    const count = await albumSchema.countDocuments();
    res.status(200).json({
      albums,
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
    const base64Image = req.body.album.album_url_image ? req.body.album.album_url_image.split(";base64,")[1] : '';
    const extenImage = req.body.imageType;
    const imageName = uuid();
    const saveImageUrl = `${path.join(rootPath, 'public/images/album')}\\${imageName}.${extenImage}`;

    // convert data
    let category = {} ;
    let country = {};
    let albumshow = {};
    if (req.body.album.album_listShow) {
      albumshow = await albumshowSchema.where({ _id: req.body.album.album_listShow });
    }

    if (req.body.album.album_category) {
      category = await categorySchema.where({ _id: req.body.album.album_category });
    }

    if (req.body.album.album_country) {
      country = await countrySchema.where({ _id: req.body.album.album_country });
    }

    const convertString = removeAccents(req.body.album.album_name).replace(/ /g, '-');

    req.body.album.album_category = category && category.length > 0 ? category[0] : {};
    req.body.album.album_country = country && country.length > 0 ? country[0] : {};
    req.body.album.album_listShow = albumshow && albumshow.length > 0 ? albumshow[0] : {};

    if (base64Image) {
      await require("fs").writeFileSync(saveImageUrl, base64Image, 'base64');
      req.body.album.album_url_image = base64Image ? `static/images/album/${imageName}.${extenImage}` : '';
    }

    const {
      album_name,
      album_category,
      album_listShow,
      album_url_image = '',
      album_country,
      album_user_id = '',
      created_at
    } = req.body.album;

    const album = new albumSchema({
      album_name,
      album_slug: convertString,
      album_category,
      album_listShow,
      album_url_image,
      album_country,
      album_user_id,
      created_at
    });

    const result = await album.save();

    res.status(200).json({
      album: result
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/', async function (req, res) {
  try {
    const album = await albumSchema.where({ _id: req.body.album._id }).updateOne({ ...req.body.album })
    if (album.ok === 1) {
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

router.patch('/view/:_id', async function (req, res) {
  try {
    const { _id } = req.params;
    const album = await albumSchema.where({ _id }).updateOne({$inc: { album_view: 1 }});
    if (album.ok === 1) {
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
    const _id = req.body.album._id;
    const result = await albumSchema.deleteOne({ _id });
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