import React, { useState } from 'react';
import './ReportBug.css';
import { Form } from 'react-bootstrap';
import ModalCancelOrder from '../../../components/Modal/ModalCancelOrder';
import ModalConfirmOrder from '../../../components/Modal/ModalConfirmOrder';

const priorities = ['High Priority', 'Medium Priority', 'Low Priority'];
const bugTypes = [
  'Functionality Issue',
  'Visual/Aesthetic Issue',
  'Performance Issue',
  'Security Issue',
  'Data/Content Issue',
  'Crash/Error Issue',
  'Usability/UX Issue',
  'Other',
];

const ReportBug = () => {
  const [selectedBug, setSelectedBug] = useState('Visual/Aesthetic Issue');
  const [selectedPriority, setSelectedPriority] = useState('Medium Priority');
  const [modalType, setModalType] = useState(null); // null | 'cancel' | 'confirm'

  const handleConfirm = (type) => {
    if (type === 'cancel') {
      alert("Order canceled.");
    } else if (type === 'confirm') {
      alert("Order confirmed.");
    }
    setModalType(null);
  };

  return (
    <div className="report-bug-container shadow-sm">
      <h4>Report A Bug</h4>

      <Form>
        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label className="required">Your Email</Form.Label>
          <Form.Control type="email" placeholder="you@example.com" />
        </Form.Group>

        {/* Bug Types */}
        <Form.Group className="mb-4">
          <Form.Label className="required">Reason for reporting this bug?</Form.Label>
          <div className="tag-group">
            {bugTypes.map((type) => (
              <div
                key={type}
                className={`tag ${selectedBug === type ? 'active' : ''}`}
                onClick={() => setSelectedBug(type)}
              >
                {type}
              </div>
            ))}
          </div>
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-4">
          <Form.Label className="required">
            Can you provide clarity on the issue? Help us understand
          </Form.Label>
          <Form.Control as="textarea" rows={5} />
        </Form.Group>

        {/* Priority */}
        <Form.Group className="mb-4">
          <Form.Label>Bug Priority</Form.Label>
          <div className="priority-group">
            {priorities.map((level) => {
              const priorityClass = level.toLowerCase().split(' ')[0];
              const isActive = level === selectedPriority ? ' active' : '';
              return (
                <div
                  key={level}
                  className={`priority-btn ${priorityClass}${isActive}`}
                  onClick={() => setSelectedPriority(level)}
                >
                  {level}
                </div>
              );
            })}
          </div>
        </Form.Group>

        {/* Upload Files */}
        <Form.Group className="mb-4">
          <Form.Label className="required">Attach files</Form.Label>
          <div className="upload-container">
            <label className="upload-box">
              <input type="file" />
              <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
              <p>Attach screenshots, screen recordings, or any other relevant files that illustrate the bug.</p>
            </label>
            <div className="file-preview">
              {/* File previews can be rendered here */}
            </div>
          </div>
        </Form.Group>

        {/* Actions */}
        <div className="action-buttons mt-3">
          <button type="button" className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn">Submit Report</button>
          <button type="button" onClick={() => setModalType('cancel')}>Cancel Order</button>
          <button type="button" onClick={() => setModalType('confirm')}>Confirm Order</button>
        </div>
      </Form>

      {/* Cancel Order Modal */}
      <ModalCancelOrder
        isOpen={modalType === 'cancel'}
        onCancel={() => setModalType(null)}
        onConfirm={() => handleConfirm('cancel')}
      />

      {/* Confirm Order Modal */}
      <ModalConfirmOrder
        isOpen={modalType === 'confirm'}
        onCancel={() => setModalType(null)}
        onConfirm={() => handleConfirm('confirm')}
      />
    </div>
  );
};

export default ReportBug;
