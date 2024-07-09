import React, { useEffect, useState } from "react";
import "./CommunityQuizzes.css";
import Sidebar from "../Sidebar/Sidebar";
import Toast from "../Toast/Toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CommunityQuizzes = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [quiz, setQuiz] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/quizzes/all`)
      .then((res) => {
        setQuiz(res.data.quizzes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likeQuiz = async (id) => { 
    try{
      let res = await axios.post('/api/quizzes/like-quiz',{quizId:id,userId:localStorage.getItem('user')});
      if(res.data.success)
      {
        setMessage('Quiz Liked Successfully');
        setShowToast(true);
        let newData = await axios.get(`/api/quizzes/all`);
        setQuiz(newData.data.quizzes);
        setTimeout(()=>{
          setShowToast(false);
        },3000)
      }
    }catch(err)
    {
      setMessage(err.message)
      console.log(err);
    }
  } 


  const takeQuiz = (quizId) => {
    navigate('/view-quiz?id='+quizId);
  }
  console.log(quiz);
  return (
    <div className="community__quizzes__wrapper">
    <Toast model= {showToast} message = {message}/>
      <div>
        <Sidebar />
      </div>
      <div className="body">
        <div className="header__top">Community Quizzes</div>
        <div className="quizzes__wrapper">
          {quiz.length != 0 ? (
            quiz.map((temp, idx) => (
              <div key={idx} className="card quiz__card ">
                <img src={temp.imgUrl || "https://picsum.photos/200"}></img>
                <div className="quiz__name">{temp.name}</div>
                <div className="category">{temp.category}</div>
                <div className="questions">
                  {temp.question.length} Question/s
                </div>
                <div className="take__quiz btn" onClick={()=>takeQuiz(temp._id)}>Take Quiz</div>
                <div className="top__section">
                  <div className="likes">
                    {temp.likes}
                    <img style={{cursor:'pointer', padding:'5px'}} onClick={()=>likeQuiz(temp._id)} src="https://png.pngtree.com/png-clipart/20210310/original/pngtree-love-heart-icon-png-image_5958163.png" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="temp ">
              🔥🔥🔥🔥🔥Loading🕐🕑🕒🕓🕔
              {setTimeout(() => {
                return <div>Added Quizzes Will be Show Here!</div>;
              }, 5000)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityQuizzes;
