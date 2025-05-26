import React from "react";
import "./ModalSendInvoice.css"; // Reuse ModalWeightChange.css or duplicate with new name

const ModalSendInvoice = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="ModalWeight-overlay">
      <div className="ModalWeight-box">
        <button className="ModalWeight-close" onClick={onCancel}>
          &times;
        </button>
        <div className="ModalWeight-icon ModalWeight-icon--primary">
          <span>!</span>
        </div>
        <h2 className="ModalWeight-title">Send Invoice?</h2>
        <p className="ModalWeight-message">
          This will send the invoice to the customer via email. Are you sure you want to proceed?
        </p>
        <div className="ModalWeight-actions">
          <button className="ModalWeight-btn ModalWeight-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="ModalWeight-btn ModalWeight-btn--primary" onClick={onConfirm}>
            Yes, Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSendInvoice;
