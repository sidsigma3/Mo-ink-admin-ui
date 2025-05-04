import React from "react";
import "./ModalShipOrder.css";

const ModalShipOrder = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="sorder-overlay">
      <div className="sorder-box">
        <button className="sorder-close" onClick={onCancel}>
          &times;
        </button>
        <div className="sorder-icon sorder-icon--primary">
          <span>!</span>
        </div>
        <h2 className="sorder-title">Mark as shipped?</h2>
        <p className="sorder-message">
          This will update the item status to "Shipped" and notify the customer.
          Are you sure you want to proceed?
        </p>
        <div className="sorder-actions">
          <button className="sorder-btn sorder-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="sorder-btn sorder-btn--primary" onClick={onConfirm}>
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalShipOrder;
