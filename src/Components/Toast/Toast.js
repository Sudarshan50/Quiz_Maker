import React,{useEffect,useRef} from "react";
import $ from "jquery";

const Toast = (props) => {
  const toastRef = useRef(null);
  useEffect(() => {
    if (toastRef.current) {
      $(toastRef.current).hide();
    }
  }, []);
  const hideScreen = () => {
    $(toastRef.current).fadeIn(200);
    document.getElementsByTagName("html")[0].style.overflow = "hidden";
  };
  const showScreen = () => {
    $(toastRef.current).fadeOut(200);
    document.getElementsByTagName("html")[0].style.overflow = "auto";
  };
  let child = undefined;
  if (props.model === true) {
    hideScreen();
  } else {
    showScreen();
  }
  if (props.model === true) {
    child = (
      <div
        ref={toastRef}
        style={{
          overflow: "scroll",
          position: "absolute",
          top: "15px",
          right: "15px",
          zIndex: props.zIndex ? props.zIndex : 20,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : "#30D158",
          width: "fit-content",
          color: "white",
          borderRadius: "5px",
          padding: "20px 30px",
        }}
      >
        {props.message}
      </div>
    );
  }
  return <div>{child}</div>;
};

export default Toast;
