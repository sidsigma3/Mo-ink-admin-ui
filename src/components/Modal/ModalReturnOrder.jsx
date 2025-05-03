import React from "react";
import "./ModalReturnOrder.css";

const ModalReturnOrder = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="mreturn-overlay">
      <div className="mreturn-box">
        <button className="mreturn-close" onClick={onCancel}>
          &times;
        </button>
        <div className="mreturn-icon warning">
          <span>!</span>
        </div>
        <h2 className="mreturn-title">Return this order?</h2>
        <p className="mreturn-message">
          This item return will be processed and the customer will be notified. Are you sure you want to proceed?
        </p>
        <div className="mreturn-actions">
          <button className="bttn bttn-outline" onClick={onCancel}>
            Reject
          </button>
          <button className="bttn bttn-warning" onClick={onConfirm}>
            Approve Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReturnOrder;
