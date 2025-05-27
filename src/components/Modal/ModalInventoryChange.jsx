import React from "react";
import "./ModalWeightChange.css";

const ModalInventoryChange = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="Modalinvchange-overlay">
      <div className="Modalinvchange-box">
        <button className="Modalinvchange-close" onClick={onCancel}>
          &times;
        </button>
        <div className="Modalinvchange-icon Modalinvchange-icon--primary">
          <span>!</span>
        </div>
        <h2 className="Modalinvchange-title">Do you want to save changes?y</h2>
        <p className="Modalinvchange-message">
        This will changes the current weights of product variants. Are you sure you want to proceed?
        </p>
        <div className="Modalinvchange-actions">
          <button className="Modalinvchange-btn Modalinvchange-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="Modalinvchange-btn Modalinvchange-btn--primary" onClick={onConfirm}>
          Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInventoryChange;
