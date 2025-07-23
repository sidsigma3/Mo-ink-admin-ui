import React, { useState } from "react";
import "./ModalConfirmOrder.css"; // reuse your existing styles

const ModalCollectAmount = ({ isOpen, onCancel, onConfirm, maxAmount }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("payment_link"); // 'payment_link' or 'manual_entry'
  const [remark, setRemark] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > maxAmount) {
      alert(`Please enter a valid amount (max ₹${maxAmount})`);
      return;
    }
    
    // Pass both amount and payment method info to parent
    onConfirm({
      amount: numericAmount,
      paymentMethod,
      remark: paymentMethod === 'manual_entry' ? remark : ''
    });
  };

  const resetForm = () => {
    setAmount("");
    setPaymentMethod("payment_link");
    setRemark("");
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={handleCancel}>
          &times;
        </button>
        <div className="modal-icon success">
          <span>&#8377;</span>
        </div>
        <h2 className="modal-title">Collect Partial Payment</h2>
        
        {/* Payment Method Selection Tabs */}
        <div className="payment-method-tabs">
          <button
            className={`tab-button ${paymentMethod === 'payment_link' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('payment_link')}
          >
            Online
          </button>
          <button
            className={`tab-button ${paymentMethod === 'manual_entry' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('manual_entry')}
          >
            Cash
          </button>
        </div>

        <p className="modal-message">
          {paymentMethod === 'payment_link' 
            ? `Enter the amount to collect via payment link (max ₹${maxAmount}):`
            : `Enter the amount collected manually (max ₹${maxAmount}):`
          }
        </p>
        
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginBottom: '15px' }}
        />

        {/* Conditional Remark Field */}
        {paymentMethod === 'manual_entry' && (
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter remark (e.g., Cash payment)"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            style={{ marginBottom: '15px' }}
          />
        )}

        <div className="modal-actions">
          <button className="bttn bttn-outline" onClick={handleCancel}>
            Cancel
          </button>
          <button className="bttn bttn-success" onClick={handleConfirm}>
            {paymentMethod === 'payment_link' ? 'Send Payment Link' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCollectAmount;