import React from "react";
import "./ModalPaid.css";

const ModalPaid = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="mpaid-overlay">
      <div className="mpaid-box">
        <button className="mpaid-close" onClick={onCancel}>
          &times;
        </button>
        <div className="mpaid-icon success">
          <span>!</span>
        </div>
        <h2 className="mpaid-title">Mark as paid?</h2>
        <p className="mpaid-message">
        This will update the payment status to "Paid". Are you sure you want to proceed?
        </p>
        <div className="mpaid-actions">
          <button className="bttn bttn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="bttn bttn-success" onClick={onConfirm}>
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPaid;
