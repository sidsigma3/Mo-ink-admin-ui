import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./ModalDeleteUser.css"; // Custom styling for delete user modal

const ModalDeleteUser = ({ isOpen, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-delete-overlay">
      <div className="modal-delete-box">
        <button className="modal-delete-close" onClick={onCancel}>
          &times;
        </button>
        <div className="modal-delete-icon">
          <span>🗑️</span>
        </div>
        <h3 className="modal-delete-title">Delete User?</h3>
        <p className="modal-delete-message">
          This action will permanently delete the user from the system. Are you sure you want to continue?
        </p>
        <div className="modal-delete-actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalDeleteUser;
