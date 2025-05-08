import React from "react";
import "./ModalAddColor.css";

const ModalAddColor = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="maddcolor-overlay">
      <div className="maddcolor-box">
        <button className="maddcolor-close" onClick={onCancel}>
          &times;
        </button>
        <div className="maddcolor-icon maddcolor-icon--primary">
          <span>!</span>
        </div>
        <h2 className="maddcolor-title">Add custom colors?</h2>
        <p className="maddcolor-message">
        This will add the selected colors as new product variants. Are you sure you want to proceed?
        </p>
        <div className="maddcolor-actions">
          <button className="maddcolor-btn maddcolor-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="maddcolor-btn maddcolor-btn--primary" onClick={onConfirm}>
          Yes, Add Color
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddColor;
