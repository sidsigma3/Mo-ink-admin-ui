import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./ModalDelete.css";

const ModalDelete = ({ isOpen, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
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
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="ModalLogout-actions">
          <button className="bttn bttn-danger" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="bttn bttn-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalDelete;
