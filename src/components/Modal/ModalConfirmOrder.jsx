import React from "react";
import "./ModalConfirmOrder.css";

const ModalConfirmOrder = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <div className="modal-icon success">
          <span>&#10003;</span>
        </div>
        <h2 className="modal-title">Confirm this order?</h2>
        <p className="modal-message">
          This order will be processed and the customer will be notified. Are you sure you want to proceed?
        </p>
        <div className="modal-actions">
          <button className="bttn bttn-success" onClick={onConfirm}>
            Confirm Order
          </button>
          <button className="bttn bttn-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmOrder;
