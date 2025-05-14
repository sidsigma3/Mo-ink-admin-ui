import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import { useEffect } from 'react';

const Toast = ({ message, onClose, type = "success" }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        minWidth: '350px'
      }}
    >
      <div
        className={`toast show align-items-center text-white border-0 d-flex mb-2 shadow 
          ${isSuccess ? 'bg-success' : 'bg-danger'}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex align-items-center px-3 py-1">
          <div className="me-2">
            {isSuccess ? (
              <FaCheckCircle className="fs-4" />
            ) : (
              <FaMinusCircle className="fs-4" />
            )}
          </div>
          <div className="toast-body fw-medium fs-6">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
