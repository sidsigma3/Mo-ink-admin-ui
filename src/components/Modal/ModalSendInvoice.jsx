import React from "react";
import "./ModalSendInvoice.css";

const ModalSendInvoice = ({
  isOpen,
  onCancel,
  onConfirm,
  modalData,
  customers
}) => {
  if (!isOpen || !modalData) return null; // ✅ SAFETY CHECK

  const matchedCustomer = customers.find((customer) =>
    customer.orders?.some(order => order.id === modalData.orderId)
  );
  const customerName = matchedCustomer?.customerName || "Customer";

  return (
    <div className="msinvoice-overlay">
      <div className="msinvoice-box">
        <button className="msinvoice-close" onClick={onCancel}>
          &times;
        </button>
        <div className="msinvoice-icon msinvoice-icon--primary">
          <span>!</span>
        </div>
        <h2 className="msinvoice-title">Are you sure?</h2>
        <p className="msinvoice-message">
          Please confirm if you’d like to send the invoice to customer <strong>{customerName}</strong> for this order ID: <strong>{modalData.orderId}</strong>?
        </p>

        <div className="msinvoice-actions">
          <button className="msinvoice-btn msinvoice-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="msinvoice-btn msinvoice-btn--primary" onClick={onConfirm}>
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSendInvoice;
