import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalSegmentList = ({ show, handleClose, segments, onSegmentAdd }) => {
  const [selectedSegment, setSelectedSegment] = useState([]);

  const handleCheckboxChange = (segment) => {
    setSelectedSegment((prev) =>
      prev.some((s) => s.segmentId === segment.segmentId)
        ? prev.filter((s) => s.segmentId !== segment.segmentId) // Remove if already selected
        : [...prev, segment] // Add if not selected
    );
  };

  const handleSegmentAdd = () => {
    onSegmentAdd(selectedSegment); // Pass selected segments to the parent
    handleClose();
  };

  return (
    <Modal className="modal modal-customer-list" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>All Segments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {segments?.map((segment, index) => (
            <li key={index} className="d-flex align-items-center">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(segment)}
                checked={selectedSegment.some((s) => s.segmentId === segment.segmentId)}
              />
              <div className="ms-2">
                <h5>{segment.segmentTitle}</h5>
                <h6 className="text-muted">{segment.segmentType}</h6>
                <h6>{segment.customerCount} Customers</h6>
              </div>
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSegmentAdd}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSegmentList;
