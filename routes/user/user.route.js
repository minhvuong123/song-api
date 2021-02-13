const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const { rootPath } = require('../../utils');
const { v1: uuid } = require('uuid');
const userSchema = require('../../models/user/user.model');

router.get('/', async function (req, res) {
  try {
    const users = await userSchema.find();
    res.status(200).json({
      users
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
    const users = await userSchema.find().skip(page * limit).limit(limit);
    const count = await userSchema.countDocuments();
    res.status(200).json({
      users,
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
    const base64Data = req.body.user.user_image_base64.split(";base64,")[1];
    const exten = req.body.typeImage;
    const imageName = uuid();
    const saveUrl = `${path.join(rootPath, 'public/images')}\\${imageName}.${exten}`;
    req.body.user.image_url = base64Data ? `static/images/${imageName}.${exten}` : '';

    if (base64Data) {
      delete req.body.user.user_image_base64;

      require("fs").writeFile(saveUrl, base64Data, 'base64', async function (err) {
        if (!err) {
          const user = new userSchema({
            user_email: req.body.user.user_email,
            user_phone: req.body.user.user_phone,
            user_password: req.body.user.user_password,
            user_role: req.body.user.user_role,
            created_at: req.body.user.created_at
          });
          const result = await user.save();
          res.status(200).json({
            user: result
          });
        }
      });
    } else {
      const user = new userSchema({
        user_email: req.body.user.user_email,
        user_phone: req.body.user.user_phone,
        user_password: req.body.user.user_password,
        user_role: req.body.user.user_role,
        created_at: req.body.user.created_at
      });
      const result = await user.save();
      res.status(200).json({
        user: result
      });
    }

  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.patch('/', async function (req, res) {
  try {
    if (req.body.user.user_image_base64) {
      const base64Data = req.body.user.user_image_base64.split(";base64,")[1];
      const exten = req.body.typeImage;
      const imageName = uuid();
      const saveUrl = `${path.join(rootPath, 'public/images')}\\${imageName}.${exten}`;
      req.body.user.image_url = `static/images/${imageName}.${exten}`;

      delete req.body.user.user_image_base64;
      delete req.body.user.status;

      require("fs").writeFile(saveUrl, base64Data, 'base64', async function (err) {
        if (!err) {
          const user = await userSchema.where({ _id: req.body.user._id }).updateOne({ ...req.body.user })
          if (user.ok === 1) {
            res.status(200).json({
              status: 'ok',
              image_url: req.body.user.image_url
            });
          }
        }
      });
    } else {
      const user = await userSchema.where({ _id: req.body.user._id }).updateOne({ ...req.body.user })
      if (user.ok === 1) {
        res.status(200).json({
          status: 'ok',
          image_url: req.body.user.image_url
        });
      }
    }

  } catch (error) {
    res.status(500).json({
      status: 'Server error'
    });
  }
})

router.post('/register', async function (req, res) {
  try {
    const user_email = req.body.user.user_email;
    const user_phone = req.body.user.user_phone;
    const user_password = bcrypt.hashSync(req.body.user.user_password, 10);
    const created_at = req.body.user.created_at;
    const user = new userSchema({ user_email, user_phone, user_password, created_at });
    const result = await user.save();

    if (Object.keys(result).length > 0) {
      res.status(200).json({
        user: result
      });
    } else {
      res.status(404).json({
        message: 'Information is error'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.post('/login', async function (req, res) {
  try {
    const user_name = req.body.user.user_name;
    const user_password = req.body.user.user_password;

    const user = await userSchema.where({ user_name }).findOne();

    if (Object.keys(user).length > 0) {
      const match = await bcrypt.compare(user_password, user.user_password);
      if (match) {
        res.status(200).json({ 
          status: 'ok'
        });
        return;
      }
      res.status(404).json({
        status: 'Password is wrong!'
      });
      return;
    }
    res.status(404).json({
      status: 'User is not found !'
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.post('/delete', async function (req, res) {
  try {
    const _id = req.body.user._id;
    const result = await userSchema.deleteOne({ _id });
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