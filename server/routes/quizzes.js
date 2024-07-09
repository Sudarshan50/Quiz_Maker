const express = require("express");
const User = require("../model/user.js");
const Quizzes = require("../model/quiz.js");
const Score = require("../model/score.js");
require("dotenv").config();
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

router.post("/create", checkAuth, async (req, res) => {
  try {
    let quiz = new Quizzes({
      ...req.body.quiz,
      createdBy: req.body.createdBy,
      question: req.body.quiz.question.map((ques) => {
        return {
          ...ques,
          answers: ques.answers.map((ans) => {
            return {
              name: ans,
              selected: false,
            };
          }),
        };
      }),
    });
    await quiz.save().then((result) => {
      res.status(200).send({ success: true, quiz: result });
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/my-quizzes/:id", async (req, res) => {
  try {
    let quizzes = await Quizzes.find({ createdBy: req.params.id });
    res.status(200).send({ success: true, quizzes });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/all", checkAuth, async (req, res) => {
  try {
    let quizzes = await Quizzes.find();
    res.status(200).send({ success: true, quizzes });
  } catch (er) {
    console.log(er);
  }
});
router.get("/get-quiz/:id", checkAuth, async (req, res) => {
  try {
    let quiz = await Quizzes.findOne({ _id: req.params.id });
    res.status(200).send({ success: true, quiz });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/add-comment", checkAuth, async (req, res) => {
  try {
    await Quizzes.updateOne(
      { _id: req.body.quizId },
      {
        $push: {
          comments: {
            sentFromId: req.body.sentFromId,
            sentFromName: req.body.sentFromName,
            message: req.body.message,
          },
        },
      }
    );
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(401).send({ message: "Error", success: false });
  }
});

router.post("/like-quiz", checkAuth, async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.body.userId,
      likedQuizzes: { $in: [req.body.quizId] },
    });
    if (!user) {
      await User.updateOne(
        { _id: req.body.userId },
        {
          $push: {
            likedQuizzes: req.body.quizId,
          },
        }
      );
      await Quizzes.updateOne({ _id: req.body.quizId }, { $inc: { likes: 1 } });
      return res.status(200).send({ message: "Added To Liked", success: true });
    } else {
      await User.updateOne(
        { _id: req.body.userId },
        {
          $pull: {
            likedQuizzes: req.body.quizId,
          },
        }
      );
      await Quizzes.updateOne(
        { _id: req.body.quizId },
        { $inc: { likes: -1 } }
      );
      return res
        .status(200)
        .send({ message: "Remove From Liked", success: true });
    }
  } catch (err) {
    return res.status(401).send({ message: "Error", success: false });
  }
});
router.post("/save-results", checkAuth, async (req, res) => {
  let score = new Score({
    quizId: req.body.quizId,
    answers: req.body.answers,
    userId: req.body.currentUser,
  });
  try {
    const response = await score.save();
    if (response) {
      await Quizzes.updateOne(
        { _id: req.body.quizId },
        { $push: { score: response._id } }
      );
      return res.status(200).send({ success: true, scoreId: response._id });
    }
    return res
      .status(400)
      .send({ success: false, message: "Error Submitting Quiz" });
  } catch (err) {
    res.send(400).send({ success: false, message: "Error Submitting Quiz" });
    console.log(err);
  }
});

router.get("/results/:id", checkAuth, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({ message: "Invalid Request" });
    } else {
      let data = await Score.findOne({ _id: req.params.id });
      if (!data) {
        return res.status(400).send({ message: "Invalid Request" });
      } else {
        let quiz = await Quizzes.findOne({ _id: data.quizId });
        if (!quiz) {
          return res.status(400).send({ message: "Invalid Request" });
        } else {
          return res.status(200).send({ success: true,score:data, quiz:quiz });
        }
      }
    }
  } catch (err) {
    return res.status(400).send({ message: "Invalid Request" });
  }
});

module.exports = router;
