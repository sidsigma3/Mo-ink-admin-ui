import React from "react";
import "./ModalPartiallypaid.css";

const ModalPartiallypaid = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="mppaid-overlay">
      <div className="mppaid-box">
        <button className="mppaid-close" onClick={onCancel}>
          &times;
        </button>
        <div className="mppaid-icon mppaid-icon--alert">
          <span>!</span>
        </div>
        <h2 className="mppaid-title">Mark as partially paid?</h2>
        <p className="mppaid-message">
        This will update the payment status to "Partially Paid". Are you sure you want to proceed?
        </p>
        <div className="mppaid-actions">
          <button className="mppaid-btn mppaid-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="mppaid-btn mppaid-btn--primary" onClick={onConfirm}>
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPartiallypaid;
