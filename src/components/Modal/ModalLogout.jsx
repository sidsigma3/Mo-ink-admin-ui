import React from "react";
import "./ModalLogout.css";

const ModalLogout = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="ModalLogout-overlay">
      <div className="ModalLogout-box">
        <button className="ModalLogout-close" onClick={onCancel}>
          &times;
        </button>
        <div className="ModalLogout-icon danger">
          <span>!</span>
        </div>
        <h2 className="ModalLogout-title">Are You Sure?</h2>
        <p className="ModalLogout-message">
        You will be signed out of your account. Do you want to proceed with the logout?
       </p>
        <div className="ModalLogout-actions">
          <button className="bttn bttn-danger" onClick={onConfirm}>
          Yes, Log Out
          </button>
          <button className="bttn bttn-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLogout;
