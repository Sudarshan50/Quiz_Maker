const mongoose = require("mongoose");
const { use } = require("passport");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  likedQuizzes:{
    type: Array,
    default:[]
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  avatar: {
    type: Object,
    required: false,
    contains: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("User", userSchema);
