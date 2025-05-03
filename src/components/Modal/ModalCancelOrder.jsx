import React from "react";
import "./ModalCancelOrder.css";

const ModalCancelOrder = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <div className="modal-icon danger">
          <span>!</span>
        </div>
        <h2 className="modal-title">Cancel this order?</h2>
        <p className="modal-message">
          This order will be permanently canceled and the customer will be notified. This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="bttn bttn-danger" onClick={onConfirm}>
            Cancel Order
          </button>
          <button className="bttn bttn-outline" onClick={onCancel}>
            Keep Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCancelOrder;
