const express = require('express');
const router = express.Router();
const path = require('path');
const { rootPath, removeAccents } = require('../../utils');
const { v1: uuid } = require('uuid');
const categorySchema = require('../../models/category/category.model');

router.get('/', async function (req, res) {
  try {
    const categories = await categorySchema.find();
    res.status(200).json({
      categories
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
    const categories = await categorySchema.find().skip(page * limit).limit(limit);
    const count = await categorySchema.countDocuments();
    res.status(200).json({
      categories,
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
    console.log(req.body.category);
    const base64Image = req.body.category.category_url_image ? req.body.category.category_url_image.split(";base64,")[1] : '';
    const extenImage = req.body.imageType;
    const imageName = uuid();
    const saveImageUrl = `${path.join(rootPath, 'public/images/category')}\\${imageName}.${extenImage}`;
    const convertString = removeAccents(req.body.category.category_name).replace(/ /g, '-');

    if (base64Image) {
      await require("fs").writeFileSync(saveImageUrl, base64Image, 'base64');
      req.body.category.category_url_image = base64Image ? `static/images/category/${imageName}.${extenImage}` : '';
    }

    const category = new categorySchema({
      category_name: req.body.category.category_name,
      category_slug: convertString,
      category_url_image: req.body.category.category_url_image,
      created_at: req.body.category.created_at
    });
    const result = await category.save();
    res.status(200).json({
      category: result
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/', async function (req, res) {
  try {
    const category = await categorySchema.where({ _id: req.body.category._id }).updateOne({ ...req.body.category })
    if (category.ok === 1) {
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
    const _id = req.body.category._id;
    const result = await categorySchema.deleteOne({ _id });
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