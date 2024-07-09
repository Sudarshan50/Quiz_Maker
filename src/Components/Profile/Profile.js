import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from "../Toast/Toast";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    user: null,
    previewSource: "",
    message: "",
    showToast: false,
    fileTypes: [
      "jpg",
      "pdf",
      "png",
      "jpeg",
      "image/jpg",
      "image/pdf",
      "image/png",
      "image/jpeg",
    ],
  });
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    let id = localStorage.getItem("user");
    if (!id) {
      navigate("/");
      // localStorage.clear();
    }
    try {
      let res = await axios.get("/api/users/" + id);
      if (res.data.user) {
        setUserData((prev) => ({ ...prev, user: res.data.user }));
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!userData.fileTypes.includes(file.type)) {
      setUserData((prev) => ({
        ...prev,
        message: "Must be either jpg, pdf, or png",
      }));
    } else {
      setUserData((prev) => ({ ...prev, message: "" }));
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    if (file.size > 10000000) {
      setUserData((prev) => ({ ...prev, message: "File size too big" }));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUserData((prev) => ({ ...prev, previewSource: reader.result }));
    };
  };
  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (
      userData.message.length > 0 ||
      !userData.previewSource ||
      Object.keys(userData.user) < 1
    )
      return;
    try {
      const res = await axios.post(
        "/api/users/upload-image",
        {
          data: userData.previewSource,
          _id: userData.user._id,
        }
      );
      if (res.data && res.data.message) {
        toast.success("Image uploaded Successfully");
        toast.warn("Please login again to see the changes");
        setUserData((prev) => ({
          ...prev,
          message: res.data.message,
          fileInput: "",
          previewSource: "",
          showPopup: true,
        }));
      } else {
        setUserData((prev) => ({
          ...prev,
          fileInput: "",
          previewSource: "",
          message: "Success",
          showPopup: true,
        }));
      }
      getUser();
    } catch (err) {
        toast.error("Something went wrong uploading image");
        console.log(err);
      setUserData((prev) => ({
        ...prev,
        showPopup: true,
        message: "Something went wrong uploading image",
      }));
    }
  };
  return (
    <div className="profile-wrapper">
      <Toast model={userData.showToast} messsage={userData.message} />
      <div>
        <Sidebar />
      </div>

      <div className="body">
        {userData.user && (
          <div className="cards">
            <div className="left">
              <div className="img-uploader">
                <div>Upload Avatar Image</div>
                <div className="upload-box">
                  <input
                    onChange={(e) => handleFileInputChange(e)}
                    type="file"
                  />
                  {userData.previewSource ? (
                    <img
                      className="display-image"
                      src={userData.previewSource}
                    />
                  ) : userData.user.avatar && userData.user.avatar.url ? (
                    <img
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        margin: "20px auto 0 25px",
                        width: "25vw",
                        height: "25vw",
                      }}
                      className="display-image"
                      src={userData.user.avatar.url}
                    />
                  ) : (
                    <img
                      className="display-image"
                      src={userData.previewSource}
                    />
                  )}
                </div>
                <div
                  style={{
                    color: userData.message === "Success" ? "green" : "red",
                    fontSize: ".8em",
                    margin: "20px 0",
                  }}
                >
                  {userData.message}
                </div>
                <button
                  className="image-btn"
                  style={{ marginTop: "20px" }}
                  onClick={(e) => handleSubmitFile(e)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
