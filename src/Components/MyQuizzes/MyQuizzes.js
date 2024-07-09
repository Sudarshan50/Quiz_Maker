import React, { useEffect, useState } from "react";
import "./myquizzes.css";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/quizzes/my-quizzes/${localStorage.getItem("user")}`)
      .then((res) => {
        setQuiz(res.data.quizzes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const takeQuiz = (quizId) => {
    navigate('/view-quiz?id='+quizId);
  }
  return (
    <div className="my-quizzes-wrapper">
      <div>
        <Sidebar />
      </div>
      <div className="body">
        <div className="header-top">My Quizzes</div>
        <div className="quizzes-wrapper">
          {quiz.length != 0 ? (
            quiz.map((temp, idx) => (
              <div key={idx} className="card quiz-card ">
                <img src={temp.imgUrl || "https://picsum.photos/200"}></img>
                <div className="quiz-name">{temp.name}</div>
                <div className="category">{temp.category}</div>
                <div className="questions">
                  {temp.question.length} Question/s
                </div>
                <div className="take-quiz btn" onClick={()=>takeQuiz(temp._id)}>Take Quiz</div>
                <div className="top-section">
                  <div className="views">
                    {temp.views}
                    <img src="https://png.pngtree.com/png-clipart/20190705/original/pngtree-vector-eye-icon-png-image_4190901.jpg" />
                  </div>
                  <div className="likes">
                    {temp.likes}
                    <img src="https://png.pngtree.com/png-clipart/20210310/original/pngtree-love-heart-icon-png-image_5958163.png" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="temp ">
              <div className="temp__text">No Quizzes Added Yet! <button className="btn2" onClick={()=>{navigate('/create-quiz')}} >Create One</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQuizzes;
