import React from "react";
import "./ModalDeliverOrder.css";

const ModalDeliverOrder = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="dorder-overlay">
      <div className="dorder-box">
        <button className="dorder-close" onClick={onCancel}>
          &times;
        </button>
        <div className="dorder-icon dorder-icon--primary">
          <span>!</span>
        </div>
        <h2 className="dorder-title">Mark as delivered?</h2>
        <p className="dorder-message">
          This will update the item status to "Delivered" and notify the customer.
          Are you sure you want to proceed?
        </p>
        <div className="dorder-actions">
          <button className="dorder-btn dorder-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="dorder-btn dorder-btn--primary" onClick={onConfirm}>
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeliverOrder;
