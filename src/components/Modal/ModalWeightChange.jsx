import React from "react";
import "./ModalWeightChange.css";

const ModalWeightChange = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="ModalWeight-overlay">
      <div className="ModalWeight-box">
        <button className="ModalWeight-close" onClick={onCancel}>
          &times;
        </button>
        <div className="ModalWeight-icon ModalWeight-icon--primary">
          <span>!</span>
        </div>
        <h2 className="ModalWeight-title">Changing Weights?</h2>
        <p className="ModalWeight-message">
        This will changes the current weights of product variants. Are you sure you want to proceed?
        </p>
        <div className="ModalWeight-actions">
          <button className="ModalWeight-btn ModalWeight-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="ModalWeight-btn ModalWeight-btn--primary" onClick={onConfirm}>
          Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWeightChange;
