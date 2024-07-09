import React from "react";
import "./Auth.css";
import axios from "axios";
import Signin from "./Signin";
import Signup from "./Signup";
import { useEffect, useRef } from "react";
import $ from "jquery";
import Toast from "../Toast/Toast";
import store from "../redux/store";
import {toast as notify} from "react-toastify";
import {useNavigate } from "react-router-dom";
import test1 from "../../Assets/test1.jpg";
const Auth = (props) => {
  const [tab, setTab] = React.useState("signin");
  const [toast, setToast] = React.useState(false);
  const navigate = useNavigate();
  const signIn = (email, password) => {
    axios
      .post("/api/users/login", { email, password })
      .then((res) => {
        if (res.data.sucess) {
          store.dispatch({
            type: 'login',
            user: res.data.user,
            token: res.data.token,
          });
          navigate("/dashboard");
          notify.success("User logged in successfully");
        }else{
          setToast(true);
          setTimeout(() => {
            setToast(false);
          }, 3000);
        }
      })
      .catch((err) => {
          setToast(true);
          setTimeout(() => {
            setToast(false);
          }, 3000);
      });
  };
  const signUp = ({ email, password, firstName, lastName }) => {
    axios
      .post("/api/users/register", { email, password, firstName, lastName })
      .then((res) => {
        if (res.data.sucess) {
          setTab("signin");
          notify.success("User registered successfully");
        }
      })
      .catch((err) => {
        notify.error("User registration failed");
        console.log(err);
      });
  };

  const handleTabChange = () => {
    setTab(tab === "signin" ? "signup" : "signin");
  };
  let page =
    tab === "signin" ? <Signin signIn={signIn} /> : <Signup signUp={signUp} />;
  return (
    <div className="auth__wrapper">
    <Toast model = {toast} message = "Incorrect Login" backgroundColor = "#FF4539"/>
      <div className="left">
        <img src={test1}></img>
      </div>
      {/* <img className = 'left' src={test1}></img> */}
      <div className="right">
        <div className="header"> Quiz Maker</div>
        <div className="sub__header"> Welcome to Quiz Maker</div>
        {page}
        <div className="new" onClick={handleTabChange}>
          {tab === "signin"
            ? "New to Quiz maker? Sign up here"
            : "Already have an account wiht us? Sign in"}
        </div>
      </div>
    </div>
  );
};

export default Auth;
