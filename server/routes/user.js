const express = require("express");
const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../config/cloudanary.js");
const checkAuth = require("../middleware/check-auth.js");
require("dotenv").config();
const {
  loginVlidator,
  registerValidator,
} = require("../validators/validators.js");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { errors, isValid } = loginVlidator(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    await User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(404).json({ email: "User not found" });
      } else {
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          if (!isMatch)
            return res.status(400).json({ password: "Password incorrect" });
          const payload = {
            id: user._id,
            name: user.firstName,
          };
          jwt.sign(
            payload,
            process.env.APP_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
              res.status(200).json({
                message: "User logged in",
                token: token,
                user,
                sucess: true,
              });
            }
          );
        });
      }
    });
  }
});

router.post("/upload-image", checkAuth, async (req, res) => {
  try {
    const fileStr = req.body.data;
    try {
      const uploadedResponse = await cloudinary.uploader.upload(fileStr);
      const user = await User.findOne({ _id: req.body._id });
      if (user) {
        user.avatar = {
          url: uploadedResponse.url,
          publicId: uploadedResponse.public_id,
        };
        await user.save();
        if (user.images) {
          user.images.push({
            url: uploadedResponse.url,
            publicId: uploadedResponse.public_id,
          });
        } else {
          user.images = [];
          user.images.push({
            url: uploadedResponse.url,
            publicId: uploadedResponse.public_id,
          });
        }
        return res.status(200).json({sucess: true, message: "Image uploaded successfully"})
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/register", async (req, res) => {
  const { errors, isValid } = registerValidator(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    const { firstName, lastName, email, password } = req.body;
    const registerUser = new User({
      firstName,
      lastName,
      email,
      password,
      createdAt: new Date(),
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(registerUser.password, salt, async (hashErr, hash) => {
        if (err || hashErr) {
          return res.status(500).json({
            message: "Server error",
          });
        }
        registerUser.password = hash;
        try {
          const user = await registerUser.save();
          res.status(201).json({
            message: "User created",
            user,
            sucess: true,
          });
        } catch (error) {
          res.status(500).json({
            message: "Server error",
          });
        }
      });
    });
  }
});

router.get("/:id", checkAuth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.status(200).json({ user, sucess: true });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
