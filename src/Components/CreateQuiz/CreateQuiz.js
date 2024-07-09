import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./createquiz.css";
import Dialog from "../Dialog/Dialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast/Toast";
const CreateQuiz = () => {
  const navigate = useNavigate();
  const [showToast, setToast] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("JWT_PAYLOAD") === null) {
      navigate("/");
    }
  }, []);
  const [quiz, setQuiz] = useState({
    category: ["Math", "Science", "Buisness", "Technology", "Misc"],
    categoryVal: "Math",
    mustBeSignedIn: false,
    quesion: [],
    name: "",
    addQuestion: false,
    questionName: "",
    answers: [],
    imgUrl: "",
    correctAnswer: "",
  });
  console.log(quiz.imgUrl);

  const selectPrivate = (e) => {
    if (e.target.checked) {
      setQuiz({ ...quiz, mustBeSignedIn: true });
    } else {
      setQuiz({ ...quiz, mustBeSignedIn: false });
    }
  };

  const addAnswer = () => {
    setQuiz({ ...quiz, answers: [...quiz.answers, quiz.addQuestion] });
  };

  const updateAnswer = (e, i) => {
    let newArr = Object.assign([], quiz.answers);
    newArr[i] = e.target.value;
    setQuiz({ ...quiz, answers: newArr });
  };

  const saveQuesion = () => {
    let quesion = {
      questionName: quiz.questionName,
      answers: quiz.answers,
      correctAnswer: quiz.correctAnswer,
    };
    setQuiz((prev) => ({
      ...prev,
      quesion: [...quiz.quesion, quesion],
      questionName: "",
      answers: [],
      correctAnswer: "",
    }));
  };
  const removeQuestion = (quesion) => {
    setQuiz((prev) => ({
      ...prev,
      quesion: quiz.quesion.filter(
        (q) => q.questionName !== quesion.questionName
      ),
    }));
  };

  const saveQuiz = () => {
    let data = {
      mustBeSignedIn: quiz.mustBeSignedIn,
      name: quiz.name,
      question: quiz.quesion,
      category: quiz.categoryVal,
      imgUrl: quiz.imgUrl,
    };
    axios
      .post("api/quizzes/create", {
        quiz: data,
        createdBy: localStorage.getItem("user"),
      })
      .then((res) => {
        if (res.data.success) {
          setQuiz((prev) => ({
            ...prev,
            categoryVal: "Math",
            quesion: [],
            answers: [],
            name: "",
            imgUrl: "",
          }));
          setToast(true);
          setTimeout(() => {
            setToast(false);
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="create__quiz__wrapper">
      <Toast
        model={showToast}
        message="Quiz Created Successfully"
        backgroundColor="#30D158"
      />
      <div>
        <Sidebar />
      </div>
      <div className="main">
        <div className="header">Create Quiz</div>
        <div className="form card">
          <input
            className="input"
            onChange={(e) =>
              setQuiz((prev) => ({ ...prev, name: e.target.value }))
            }
            value={quiz.name}
            placeholder="Quiz Name"
          ></input>
          <br></br>
          <input
            className="input"
            value={quiz.imgUrl}
            onChange={(e) =>
              setQuiz((prev) => ({ ...prev, imgUrl: e.target.value }))
            }
            placeholder="Img Url"
          ></input>
          <br></br>
          <select
            value={quiz.categoryVal}
            onChange={(e) =>
              setQuiz((prev) => ({ ...prev, categoryVal: e.target.value }))
            }
            className="input select"
            placeholder="Category"
          >
            {quiz.category.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="checkbox">
            <span>Must Be Logged In</span>
            <input
              type="checkbox"
              checked={quiz.mustBeSignedIn}
              onChange={selectPrivate}
              placeholder="Must Be Logged In"
            ></input>
          </div>
          {quiz.quesion.map((q, idx) => (
            <div className="question" key={idx}>
              <div>{q.questionName}</div>
              <div>{q.correctAnswer}</div>
              <div>{q.answers.length}</div>
              <button className="btn delete" onClick={() => removeQuestion(q)}>
                Delete
              </button>
            </div>
          ))}
          <div className="question">
            <div
              className="add__question"
              onClick={() =>
                setQuiz((prev) => ({ ...prev, addQuestion: true }))
              }
            >
              Add Quesion
            </div>
          </div>
          <span onClick={() => saveQuiz()} className="btn save__quiz">
            Save Quiz
          </span>
          <Dialog model={quiz.addQuestion}>
            <div className="new__quesion__form">
              <input
                className="input"
                placeholder="quesion"
                value={quiz.questionName}
                onChange={(e) =>
                  setQuiz((prev) => ({ ...prev, questionName: e.target.value }))
                }
              ></input>
              <div>Answers</div>
              {quiz.answers.map((a, idx) => (
                <div className="answer__form" key={idx}>
                  <input
                    type="radio"
                    value={quiz.answers}
                    onChange={(e) =>
                      setQuiz((prev) => ({ ...prev, correctAnswer: a }))
                    }
                    name="answers"
                  ></input>
                  <input
                    className="input"
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={quiz.answers[idx]}
                    onChange={(e) => updateAnswer(e, idx)}
                  ></input>
                </div>
              ))}
              <div className="add__answer" onClick={addAnswer}>
                Add Answers
              </div>
              <div className="btn__wrapper">
                <div
                  className="btn"
                  onClick={(e) =>
                    setQuiz((prev) => ({ ...quiz, addQuestion: false }))
                  }
                >
                  Close
                </div>
                <div className="btn" onClick={saveQuesion}>
                  Save
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
