import React from "react";
import "./ModalSendInvoice.css";

const ModalSendInvoice = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="msinvoice-overlay">
      <div className="msinvoice-box">
        <button className="msinvoice-close" onClick={onCancel}>
          &times;
        </button>
        <div className="msinvoice-icon msinvoice-icon--primary">
          <span>!</span>
        </div>
        <h2 className="msinvoice-title">Send Invoice?</h2>
        <p className="msinvoice-message">
          This will send the invoice to the customer via email. Are you sure you want to proceed?
        </p>
        <div className="msinvoice-actions">
          <button className="msinvoice-btn msinvoice-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="msinvoice-btn msinvoice-btn--primary" onClick={onConfirm}>
            Yes, Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSendInvoice;
