import React from "react";
import "./ModalUnpaid.css";

const ModalUnpaid = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="munpaid-overlay">
      <div className="munpaid-box">
        <button className="munpaid-close" onClick={onCancel}>
          &times;
        </button>
        <div className="munpaid-icon munpaid-icon--alert">
          <span>!</span>
        </div>
        <h2 className="munpaid-title">Mark as unpaid?</h2>
        <p className="munpaid-message">
        This will update the payment status to "Unpaid". Are you sure you want to proceed?
        </p>
        <div className="munpaid-actions">
          <button className="munpaid-btn munpaid-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="munpaid-btn munpaid-btn--primary" onClick={onConfirm}>
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUnpaid;
