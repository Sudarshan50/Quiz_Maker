import React, { useEffect } from "react";
import "./sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import store from "../redux/store";

const Sidebar = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("JWT_PAYLOAD") === null) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {});
    unsubscribe();
  }, []);
  const bgImage = () => {
    if (store.getState().user.avatar && store.getState().user.avatar.url) {
      return `url(${store.getState().user.avatar.url})`;
    } else {
      return `url(https://cdn-icons-png.flaticon.com/512/3541/3541871.png)`;
    }
  };

  {
    if (store.getState()?.user) {
      return (
        <div className="side__wrapper">
          <div className="header">Quiz Maker</div>
          <div className="user">
            <div
              className="avatar"
              style={{
                backgroundImage: bgImage(),
              }}
            ></div>
            <div className="name">
              {store.getState().user.firstName +
                " " +
                store.getState().user.lastName}
            </div>
            <button className="btn2" style={{marginTop:'1em'}} onClick={()=> {navigate('/'); localStorage.clear()}}>Log Out</button>
          </div>
          <div className="links">
            <NavLink to="/dashboard" className="link">
              Dashboard
            </NavLink>
            <NavLink to="/account" className="link">
              Account
            </NavLink>
            <NavLink to="/my-quizzes" className="link">
              My Quizzes
            </NavLink>
            <NavLink to="/create-quiz" className="link">
              Create Quiz
            </NavLink>
            <NavLink to="/community-quizzes" className="link">
              Community Quizzes
            </NavLink>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          Loading.....
          {setTimeout(() => {
            navigate("/");
          }, 1000)}
        </div>
      );
    }
  }
};

export default Sidebar;
