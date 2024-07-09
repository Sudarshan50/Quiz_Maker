import React, { useEffect, useState } from "react";
import "./TakeQuiz.css";
import ProgressBar from "../ProgressBar/ProgressBar";
import axios from "axios";
import $ from "jquery";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const TakeQuiz = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    quiz: {},
    authorized: false,
    answers: [],
    activeQuestionIdx: 0,
    percentage: 0,
  });
  console.log(quizData)
  useEffect(() => {
    $("#modal-wrapper-quiz").hide();
    if (location.state != undefined) {
      setQuizData((prev) => ({ ...prev, authorized: true }));
      setQuizData((prev) => ({
        ...prev,
        quiz: location.state.quiz,
        answers: Array(location.state.quiz.question.length).fill(0),
      }));
    }
  }, []);
  const prevQuestion = () => {
    let newIdx = quizData.activeQuestionIdx;
    newIdx--;
    if (newIdx < 0) return;
    setQuizData((prev) => ({ ...prev, activeQuestionIdx: newIdx }));
  };

  const nextQuestion = () => {
    let newIdx = quizData.activeQuestionIdx;
    newIdx++;
    if (newIdx === quizData.quiz.question.length) return;
    setQuizData((prev) => ({ ...prev, activeQuestionIdx: newIdx }));
  };

  const getPercentage = (ans) => {
    let total = 0;
    ans.forEach((answer) => {
      if (answer !== 0) {
        total += 1 / quizData.answers.length;
      }
    });
    setQuizData((prev) => ({ ...prev, percentage: total }));
  };
//   console.log(quizData.quiz.question)
  const selectAnswer = (ans, idx) => {
    let question = quizData.quiz;
    question.question[quizData.activeQuestionIdx].answers.forEach((ans) => 
    {
      ans.selected = false;
    });
    question.question[quizData.activeQuestionIdx].answers[
      idx
    ].selected = true;
    let answers = quizData.answers;
    if (
      ans.name ===
      quizData.quiz.question[quizData.activeQuestionIdx].correctAnswer
    ) {
      answers[quizData.activeQuestionIdx] = true;
    } else {
      answers[quizData.activeQuestionIdx] = false;
    }
    setQuizData((prev) => ({ ...prev, quiz: question, answers: answers }));
    getPercentage(answers);
  };

  const showModal = () => {
    $("#modal-wrapper-quiz").fadeIn(300);
  };

  const hideModal = () => {
    $("#modal-wrapper-quiz").fadeOut(300);
  };

  const finishQuiz = async () => {
    try {
      let res = await axios.post("/api/quizzes/save-results", {
        currentUser: localStorage.getItem("user"),
        answers: quizData.answers,
        quizId: quizData.quiz._id,
      });
      if (res.data) {
        toast.success("Quiz Submitted Successfully");
        navigate("/view-result?id=" + res.data.scoreId);
      }
    } catch (e) {
        toast.error("Error Submitting Quiz");
      console.log(e);
    }
  };

  return (
    <>
      <div id="modal-wrapper-quiz" className="modal-wrapper-quiz">
        <div className="content">
          <div className="header">
            Are you sure you wish to submit your answers
          </div>
          <div className="buttons-wrapper">
            <button onClick={hideModal}>Cancel</button>
            <button onClick={finishQuiz}>Yes</button>
          </div>
        </div>
      </div>
      <div className="take-quiz-wrapper">
        {quizData.authorized ? (
          <div className="content">
            <div className="header">
              <div className="left">{quizData.quiz.quizName}</div>
              <ProgressBar
                className="center"
                progress={Number((quizData.percentage * 100).toFixed(0))}
                size={160}
                strokeWidth={15}
                circleOneStroke="#dadfea"
                circleTwoStroke={"#00aaf1"}
              />
            </div>

            <div className="body">
              <div className="left">
                <div className="question-name">
                  {quizData.quiz.question[quizData.activeQuestionIdx].questionName}
                </div>
                <div className="question-bubble-wrapper">
                  {quizData.quiz.question.map((ans, idx) => (
                    <span
                      onClick={() =>
                        setQuizData((prev) => ({
                          ...prev,
                          activeQuestionIdx: idx,
                        }))
                      }
                      key={idx}
                      className={
                        quizData.activeQuestionIdx === idx
                          ? "question-bubble selected-bubble"
                          : quizData.answers[idx] === 0
                          ? "question-bubble"
                          : "question-bubble bubble-correct"
                      }
                    >
                      {idx + 1}
                    </span>
                  ))}
                </div>
              </div>
              <div className="right">
                <div className="answers-wrapper">
                  {quizData.quiz.question[quizData.activeQuestionIdx].answers.map((ans, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectAnswer(ans, idx)}
                      className={ans.selected === true ? "selected" : "answer"}
                    >
                      {ans.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="footer">
              <div className="buttons-wrapper">
                <button onClick={prevQuestion}>Previous</button>
                {quizData.activeQuestionIdx + 1 <
                quizData.quiz.question.length ? (
                  <button onClick={nextQuestion}>Next</button>
                ) : (
                  <button onClick={showModal}>Submit Quiz</button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>Not authorized</div>
        )}
      </div>
    </>
  );
};

export default TakeQuiz;
