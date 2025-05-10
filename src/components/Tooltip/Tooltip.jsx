import React from 'react';
import { FiAlertCircle } from "react-icons/fi";
import './Tooltip.css'; // We'll add custom styles separately if needed

const Tooltip = () => {
  return (
    <div className="position-relative d-inline-block">
      <button
        type="button"
        className="btn position-relative rounded-pill fw-semibold d-flex align-items-center gap-2 info-btn"
      >
         <div className="alert-icon-circle">
    <FiAlertCircle size={16} color="red" />
  </div>
      </button>

      <div className="custom-tooltip bg-white text-dark p-3 rounded-4 shadow-lg border border-light-subtle">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="d-flex justify-content-center align-items-center rounded-circle bg-danger bg-opacity-10" style={{ width: '32px', height: '32px' }}>
          <FiAlertCircle size={16} color="red" className="text-danger" />        
          </div>
          <h6 className="mfont mb-0 fw-semibold">Return Requested</h6>
        </div>

        <p className="mfonth small mb-2 text-light">
        Due to <strong>Color Mismatch</strong>, the customer initiated the return of the product.
        </p>


        {/* <div className="d-flex align-items-center gap-1 small text-muted">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            />
          </svg>
          <span>Premium Feature</span>
        </div> */}
      </div>
    </div>
  );
};

export default Tooltip;
