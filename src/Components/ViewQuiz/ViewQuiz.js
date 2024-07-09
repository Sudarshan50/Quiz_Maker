import React, { useEffect, useState } from "react";
import qs from "qs";
import "./ViewQuiz.css";
import axios from "axios";
import user from "../../Assets/user.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import store from "../redux/store";

const ViewQuiz = (props) => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    id: "",
    quiz: {},
    mustBeSignedIn: true,
    isLoading: true,
    isAuthenticated: true,
    inputVal: "",
  });
  useEffect(() => {
    const qstring = window.location.search;
    let quizId = qs.parse(qstring, { ignoreQueryPrefix: true }).id;
    setQuizData((prevData) => ({
      ...prevData,
      id: quizId,
    }));
    refreshQuiz();
  }, []);
  const checkAuth = () => {
    if (
      quizData.mustBeSignedIn &&
      localStorage.getItem("JWT_PAYLOAD" && localStorage.getItem("user"))
    ) {
        setQuizData((prevData)=>({
            ...prevData,
            isAuthenticated:true
        }))
    } else if (quizData.mustBeSignedIn) {
        setQuizData((prevData)=>({
            ...prevData,
            isAuthenticated:false
        }))
    }
  };

  const refreshQuiz = async () => {
    try {
      const qstring = window.location.search;
      const res = await axios.get(
        `/api/quizzes/get-quiz/${
          qs.parse(qstring, { ignoreQueryPrefix: true }).id
        }`
      );     
      if (res.data.success === true) {
        const tempQuizStore = res.data.quiz;
        setQuizData((prevData) => ({
          ...prevData,
            quiz: tempQuizStore,
            isLoading:false,
        }));
        toast.success("Quiz Loaded Successfully");
        // checkAuth();
      }
    } catch (err) {
      toast.error("Error Loading Quiz");
      console.log(err);
    }
  };
  const startQuiz = () => {
    navigate(`/take-quiz?${quizData.id}`, { state:quizData });
  };
  const addComment = async () => {
    if (!quizData.inputVal.length) {
      return;
    }
    try {
      let res = await axios.post("/api/quizzes/add-comment", {
        quizId: quizData.id,
        sentFromId: localStorage.getItem("user"),
        sentFromName: store.getState().user.firstName,
        message: quizData.inputVal,
      });
      if (res.data.success) {
        toast.success("Comment Added Successfully");
        refreshQuiz();
        setQuizData((prevData) => ({
            ...prevData,
            inputVal: "",   
        }));
      }
    } catch (err) {
      toast.error("Error Adding Comment");
      console.log(err);
    }
  };
  return !quizData.isLoading ? (
    <div className="view-quiz">
        {!quizData.isAuthenticated ? <div className="not-auth">You must be logged in to take this quiz</div> : 
        <div className="content">
            <div className="header">
                {quizData.quiz.name}
            </div>
            <div className="body">
                <div className="left">
                    <div className="description">{quizData.quiz.description}</div>
                    <div className="comments">
                        {quizData.quiz.comments?.map((com, idx) => (
                            <div className="comment" key={idx}>
                                <img style={{borderRadius: '100%'}} className="img" src={user} />
                                <div>{}</div>
                                <div>{com.message}</div>
                                <div>{com.sentFromName}</div>
                            </div>
                        ))}
                        <div className="input-field">
                            <input value={quizData.inputVal} onChange={e => setQuizData((prev)=>({...prev,inputVal: e.target.value}))} type="text" placeholder="Add a new comment" />
                            <button onClick={addComment}>Send</button>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="questions-num">{quizData.quiz.questions?.length} Questions</div>
                    <div className={quizData.quiz.createdBy === localStorage.getItem('user') ? 'questions-wrapper' : 'questions-wrapper no-scroll'}>
                        {quizData.quiz.question?.map((question, idx) => (
                            <div className="question" key={idx}>
                                <div>{quizData.quiz.createdBy === localStorage.getItem('user') ? question.questionName : 'question name'}</div>
                                <div>{quizData.quiz.createdBy === localStorage.getItem('user') ? question.correctAnswer : 'answer'}</div>
                            </div>
                        ))}
                        {quizData.quiz.createdBy !== localStorage.getItem('user') ? <div className="hidden"><div>Must be creator to look at questions</div></div> : ''}
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="buttons-wrapper">
                    <button onClick={() => navigate(-1)}>Go Back</button>
                    <button onClick={startQuiz}>Take Quiz</button>
                </div>
            </div>
        </div>
        }
    </div>
) : <h2>Loading</h2>
}

export default ViewQuiz;
