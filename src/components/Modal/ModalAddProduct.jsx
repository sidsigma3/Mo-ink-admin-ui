import React from "react";
import "./ModalAddProduct.css";

const ModalAddProduct = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="ModalAddProduct-overlay">
      <div className="ModalAddProduct-box">
        <button className="ModalAddProduct-close" onClick={onCancel}>
          &times;
        </button>
        <div className="ModalAddProduct-icon primary">
          <span>!</span>
        </div>
        <h2 className="ModalAddProduct-title">Are You Sure?</h2>
        <p className="ModalAddProduct-message">
        You have made changes to your product information, Are you sure you want to proceed?
       </p>
        <div className="ModalAddProduct-actions">
         
          <button className="bttn bttn-outline" onClick={onCancel}>
            Cancel
          </button>
           <button className="bttn bttn-primary" onClick={onConfirm}>
          Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddProduct;
