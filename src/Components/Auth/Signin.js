import React, { useState } from "react";
import "./Signin.css";
import axios from "axios";

const Signin = (props) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  // console.log(data);
  console.log(data.email);
  console.log(data.password);
  return (
    <div className="sign__in__wrapper">
      <div className="form">
        <div className="input__wrapper">
          <div>Email Address</div>
          <input
            className="input"
            type="text"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({...data, email: e.target.value })}
          />
        </div>
        <div className="input__wrapper">
          <div>Password</div>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({...data,password: e.target.value })}
          />
          <button
            onClick={() => props.signIn(data.email, data.password)}
            className="btn"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
