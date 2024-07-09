import React, { useState } from "react";
import "./Signup.css";

const Signup = (props) => {
  const [tab,changeTab] = useState('signup')
  const [data, setData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
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
          <div className="input__wrapper">
            <div>First Name</div>
            <input
              className="input"
              type="text"
              placeholder="First Name"
              value={data.firstName}
              onChange={(e) => setData({...data,firstName: e.target.value })}
            />
          </div>
          <div className="input__wrapper">
            <div>Last Address</div>
            <input
              className="input"
              type="text"
              placeholder="Last Name"
              value={data.lastName}
              onChange={(e) => setData({...data,lastName: e.target.value })}
            />
          </div>
          <button
            onClick={() => props.signUp({...data})}
            className="btn"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
