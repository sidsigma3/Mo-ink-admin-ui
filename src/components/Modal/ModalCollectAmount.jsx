import React, { useState } from "react";
import "./ModalConfirmOrder.css"; // reuse your existing styles

const ModalCollectAmount = ({ isOpen, onCancel, onConfirm, maxAmount }) => {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > maxAmount) {
      alert(`Please enter a valid amount (max ₹${maxAmount})`);
      return;
    }
    onConfirm(numericAmount);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <div className="modal-icon success">
          <span>&#8377;</span>
        </div>
        <h2 className="modal-title">Collect Partial Payment</h2>
        <p className="modal-message">
          Enter the amount to collect via payment link (max ₹{maxAmount}):
        </p>
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="modal-actions">
          <button className="bttn bttn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="bttn bttn-success" onClick={handleConfirm}>
            Send Payment Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCollectAmount;
