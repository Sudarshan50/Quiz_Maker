import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";

import Sidebar from "../Sidebar/Sidebar";
import "./ViewResult.css";
import { useLocation, useNavigate } from "react-router-dom";

const ViewResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState({
    result: null,
    quiz: null,
  });
  console.log(results);
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
      localStorage.clear();
    } else {
      let id = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      }).id;
      if (!id) {
        navigate("/");
      } else {
        axios.get("/api/quizzes/results/" + id).then((res) => {
          setResults((prev) => ({
            ...prev,
            result: res.data.score,
            quiz: res.data.quiz,
          }));
        });
      }
    }
  }, []);
  const getBorderLeft = (idx) => {
    if (results.result.answers[idx]) {
      return "5px solid green";
    } else {
      return "5px solid red";
    }
  };

  const getScore = () => {
    let len = results.result.answers.length;
    let right = results.result.answers.filter((ans) => ans === true);
    return 100 * (right.length / len) + "%";
  };
  return (
    <div className="view-results-wrapper">
      <div>
        <Sidebar />
      </div>
      {results.quiz && results.result && (
        <div className="body">
          <div className="header">Quiz Results</div>
          <div className="quiz-data">
            <div className="left">
              <div className="header">{results.quiz.name}</div>
              <div className="category">{results.quiz.category}</div>
              <div className="comments">
                {results.quiz.comments.length} Comments
              </div>
            </div>
            <div className="right">
              <div className="likes">{results.quiz.likes} Likes</div>
              <div className="others">
                {results.quiz.score.length} Other people have taken this quiz
              </div>
            </div>
          </div>

          <div className="score">Score: {getScore()}</div>

          <div className="answers">
            {results.quiz.question.map((q, idx) => (
              <div
                key={idx}
                className="answer"
                style={{ borderLeft: getBorderLeft(idx) }}
              >
                <div>{q.questionName}</div>
              </div>
            ))}
          </div>

          <div className="img">
            <img
              src={
                results.quiz.imgUrl
                  ? results.quiz.imgUrl
                  : "https://images.unsplash.com/photo-1518770660439-4636190af475?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResult;
