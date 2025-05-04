import React from "react";
import "./ModalManufactureOrder.css";

const ModalManufactureOrder = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="morder-overlay">
      <div className="morder-box">
        <button className="morder-close" onClick={onCancel}>
          &times;
        </button>
        <div className="morder-icon morder-icon--primary">
          <span>!</span>
        </div>
        <h2 className="morder-title">Mark as manufactured?</h2>
        <p className="morder-message">
          This will update the item status to "Manufactured" and notify the customer.
          Are you sure you want to proceed?
        </p>
        <div className="morder-actions">
          <button className="morder-btn morder-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="morder-btn morder-btn--primary" onClick={onConfirm}>
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalManufactureOrder;
