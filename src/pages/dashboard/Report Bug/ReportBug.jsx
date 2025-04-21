import React, { useState } from 'react';
import './ReportBug.css';
import { Form, Button } from 'react-bootstrap';

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

const priorities = ['High Priority', 'Medium Priority', 'Low Priority'];

const ReportBug = () => {
  const [selectedBug, setSelectedBug] = useState('Visual/Aesthetic Issue');
  const [selectedPriority, setSelectedPriority] = useState('Medium Priority');

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
            {priorities.map((level) => (
              <div
                key={level}
                className={`priority-btn ${
                  level === selectedPriority ? level.toLowerCase().split(' ')[0] + ' active' : level.toLowerCase().split(' ')[0]
                }`}
                onClick={() => setSelectedPriority(level)}
              >
                {level}
              </div>
            ))}
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
        </div>
      </Form>
    </div>
  );
};

export default ReportBug;
