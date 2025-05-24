import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { Form } from 'react-bootstrap';
import './ReportBug.css';
import Toast from '../../../components/Toast/Toast';

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
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toasts, setToasts] = useState([]);



  const handleSubmit = (e) => {
     const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
    e.preventDefault();

    const formData = {
      user_email: email,
      bug_type: selectedBug,
      priority: selectedPriority,
      description: description,
      attachment: file ? file.name : 'No file attached',
    };

    emailjs
      .send('service_hmdvy1a', 'template_4tvas4g', formData, 'xSdlnpzRkYS5A05r6')
      .then(
        () => {
          showToast('Bug report submitted successfully!', 'success');
          setEmail('');
          setDescription('');
          setSelectedBug('Visual/Aesthetic Issue');
          setSelectedPriority('Medium Priority');
          setFile(null);
        },
        (error) => {
          showToast('Failed to submit the bug report. Try again.' , 'error');
          console.error('EmailJS error:', error);
        }
      );
  };

  return (
    <div className="report-bug-container shadow-sm">
      <h4>Report A Bug</h4>

      <Form onSubmit={handleSubmit}>
        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label className="required">Your Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
          <Form.Control
            as="textarea"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
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
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
              <p>Attach screenshots, screen recordings, or any other relevant files that illustrate the bug.</p>
            </label>
            <div className="file-preview">
              {file && <p>File: {file.name}</p>}
            </div>
          </div>
        </Form.Group>

        {/* Actions */}
        <div className="action-buttons mt-3">
          <button type="button" className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn">Submit Report</button>

        </div>
      </Form>

  {/* Toast Notification */}
     <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                        }
                    />
                ))}
            </div>

    </div>
  );
};

export default ReportBug;
