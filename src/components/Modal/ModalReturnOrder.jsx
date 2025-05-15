import React from "react";
import "./ModalReturnOrder.css";

const ModalReturnOrder = ({ isOpen, onClose ,onCancel, onConfirm, variantDetails}) => {
  if (!isOpen || !variantDetails) return null;

  return (
    <div className="mreturn-overlay">
      <div className="mreturn-box">
        <button className="mreturn-close" onClick={onClose}>
          &times;
        </button>
        <div className="mreturn-icon warning">
          <span>!</span>
        </div>
        <h2 className="mreturn-title">Return Request Details</h2>
        <div className="mreturn-details ">
          {/* <p><strong>Color:</strong> {variantDetails.colorName}</p>
          <p><strong>Type:</strong> {variantDetails.type}</p>
          <p><strong>Weight:</strong> {variantDetails.weight} kg</p> */}
          <p className="mb-1"> Reason: <strong>{variantDetails.statusReason}</strong></p>
          <p>Returned Weight: <strong>{variantDetails.weight}kg</strong></p>

        </div>
        <p className="mreturn-message">
          Are you sure you want to approve or reject the return?
        </p>
        <div className="mreturn-actions">
          <button className="bttn bttn-outline" onClick={() => onCancel(variantDetails)}>
            Reject
          </button>
          <button className="bttn bttn-warning" onClick={() => onConfirm(variantDetails)}>
            Approve Return
          </button>
        </div>
      </div>
    </div>
  );
};


export default ModalReturnOrder;
