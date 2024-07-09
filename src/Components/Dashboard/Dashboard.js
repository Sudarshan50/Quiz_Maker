import React, { useEffect } from "react";
import "./dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("JWT_PAYLOAD") === null){
      navigate('/');
    }
  },[])
  return (
    <div className="dashboard__wrapper">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main">
        <div className="top">
          <div className="left">
            <div className="header">Statistcs</div>
          </div>
          <div className="right">
            <div className="header">My Quizzes</div>
          </div>
        </div>
        <div className="bottom"> </div>
      </div>
    </div>
  );
};

export default Dashboard;


