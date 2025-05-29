import React from "react";
import "./ModalInventoryChange.css";

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
        <h2 className="Modalinvchange-title">Confirm Weight Adjustment</h2>
        <p className="Modalinvchange-message">
        This action will update the current weight values of product variants. Are you sure you want to proceed?
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
