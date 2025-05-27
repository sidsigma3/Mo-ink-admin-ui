import React from 'react';
import { FiAlertCircle } from "react-icons/fi";
import './Tooltip.css';

const TooltipVendor = () => {
  return (
    <div className="tooltip-wrapper position-relative d-inline-block">
      <div className="alert-icon-circle">
        <FiAlertCircle size={16} color="red" />
      </div>

      <div className="custom-tooltip bg-white text-dark p-3 rounded-4 shadow-lg border border-light-subtle">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div
            className="d-flex justify-content-center align-items-center rounded-circle bg-danger bg-opacity-10"
            style={{ width: '32px', aspectRatio: '1' }}
          >
            <FiAlertCircle size={16} color="red" className="text-danger" />
          </div>
          <h6 className="mfont mb-0 fw-bold">Stock Warning</h6>
        </div>

        <p className="mfonth small mb-2 text-light">
        Total Available weight in inventory is less than total customer order. Action is needed.     
       </p>
      </div>
    </div>
  );
};

export default TooltipVendor;
