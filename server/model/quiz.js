const mongoose = require("mongoose");
const { use } = require("passport");
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  mustBeSignedIn: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  question: {
    type: Object,
    contains: {
      answers: { type: Array },
      correctAnswer: { type: String },
      questionName: String,
    },
  },
  views:{
    type: Number,
    required: false,
    default: 0
  },

  likes:{
    type: Number,
    required: false,
    default: 0
  },
  createdBy:{
    type: Schema.Types.ObjectId,
    required: true
  },
  score:{
    type:Array,
    default:[]
  },
  comments:[{
    type:Object,
    contains:{
      sentFromId:Schema.Types.ObjectId,
      sentFromName:{type:String,default:"Anonymous"},
      message:{type:String},
    }
  }],
  imgUrl:{
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Quizzes", QuizSchema);
