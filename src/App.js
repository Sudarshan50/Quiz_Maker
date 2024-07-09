import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Redirect,
  Routes,
} from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import store from "./Components/redux/store";
import Dashboard from "./Components/Dashboard/Dashboard";
import axios from "axios";
import Sidebar from "./Components/Sidebar/Sidebar";
import CreateQuiz from "./Components/CreateQuiz/CreateQuiz";
import MyQuizzes from "./Components/MyQuizzes/MyQuizzes";
import CommunityQuizzes from "./Components/CommunityQuizzes/CommunityQuizzes";
import ViewQuiz from "./Components/ViewQuiz/ViewQuiz";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TakeQuiz from "./Components/TakeQuiz/TakeQuiz";
import Profile from "./Components/Profile/Profile";
import ViewResult from "./Components/ViewResult/ViewResult";
function App() {
  useEffect(() => {
    if (localStorage.getItem("user")) {
      axios
        .get(`api/users/${localStorage.getItem("user")}`)
        .then((res) => {
          store.dispatch({
            user: res.data.store,
            type: "set__user",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
    <ToastContainer />
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" Component={Auth} />
          //push the dashboard component to the route /dashboard
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/create-quiz" Component={CreateQuiz} />
          <Route path="/my-quizzes" Component={MyQuizzes} />
          <Route path="/community-quizzes" Component={CommunityQuizzes} />
          <Route path="/view-quiz" Component={ViewQuiz} />
          <Route path="/take-quiz" Component={TakeQuiz} />
          <Route path="/view-result" Component={ViewResult} />
          <Route path="/account" Component={Profile} />
          <Route path="*" Redirect to="/" />
        </Routes>
      </BrowserRouter>
    </div>
    </>
  );
}

export default App;
