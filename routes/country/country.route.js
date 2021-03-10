const express = require('express');
const router = express.Router();
const { removeAccents } = require('../../utils');
const countrySchema = require('../../models/country/country.model');

router.get('/', async function (req, res) {
  try {
    const countries = await countrySchema.find();
    res.status(200).json({
      countries
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
    const countries = await countrySchema.find().skip(page * limit).limit(limit);
    const count = await countrySchema.countDocuments();
    res.status(200).json({
      countries,
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
    const convertString = removeAccents(req.body.country.country_name).replace(/ /g, '-');
    const country = new countrySchema({
      country_name: req.body.country.country_name,
      country_slug: convertString,
      created_at: req.body.country.created_at
    });
    const result = await country.save();
    res.status(200).json({
      country: result
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/', async function (req, res) {
  try {
    const country = await countrySchema.where({ _id: req.body.country._id }).updateOne({ ...req.body.country })
    if (country.ok === 1) {
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
    const _id = req.body.country._id;
    const result = await countrySchema.deleteOne({ _id });
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