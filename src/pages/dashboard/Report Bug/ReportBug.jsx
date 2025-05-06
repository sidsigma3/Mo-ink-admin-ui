import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Form } from 'react-bootstrap';
import './ReportBug.css';

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      user_email: email,
      bug_type: selectedBug,
      priority: selectedPriority,
      description: description,
      attachment: file ? file.name : 'No file attached', 
    };

    // Send the email via EmailJS
    emailjs
      .send('service_hmdvy1a', 'template_zuxwz8b', formData, 'xSdlnpzRkYS5A05r6')
      .then(
        (response) => {
          alert('Bug report submitted successfully!');
        },
        (error) => {
          alert('Failed to submit the bug report. Please try again later.');
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
    </div>
  );
};

export default ReportBug;






// import React, { useState } from 'react';
// import './ReportBug.css';
// import { Form } from 'react-bootstrap';
// import ModalCancelOrder from '../../../components/Modal/ModalCancelOrder';
// import ModalConfirmOrder from '../../../components/Modal/ModalConfirmOrder';
// import ModalManufactureOrder from '../../../components/Modal/ModalManufactureOrder';
// import ModalShipOrder from '../../../components/Modal/ModalShipOrder';
// import ModalDeliverOrder from '../../../components/Modal/ModalDeliverOrder';
// import ModalPaid from '../../../components/Modal/ModalPaid';
// import ModalUnpaid from '../../../components/Modal/ModalUnpaid';
// import ModalPartiallypaid from '../../../components/Modal/ModalPartiallypaid';
// import ModalReturnOrder from '../../../components/Modal/ModalReturnOrder';


// const priorities = ['High Priority', 'Medium Priority', 'Low Priority'];
// const bugTypes = [
//   'Functionality Issue',
//   'Visual/Aesthetic Issue',
//   'Performance Issue',
//   'Security Issue',
//   'Data/Content Issue',
//   'Crash/Error Issue',
//   'Usability/UX Issue',
//   'Other',
// ];

// const ReportBug = () => {
//   const [selectedBug, setSelectedBug] = useState('Visual/Aesthetic Issue');
//   const [selectedPriority, setSelectedPriority] = useState('Medium Priority');
//   const [modalType, setModalType] = useState(null); // null | 'cancel' | 'confirm' | 'manufactured'

//   const handleConfirm = (type) => {
//     if (type === 'cancel') {
//       alert("Item canceled.");
//     } else if (type === 'confirm') {
//       alert("Item confirmed.");
//     } else if (type === 'manufactured') {
//       alert("Item manufactured.");
//     } else if (type === 'shipped') {
//       alert("Item shipped.");
//     } else if (type === 'delivered') {
//       alert("Item delivered.");
//     } else if (type === 'paid') {
//       alert("Order paid.");
//     } else if (type === 'unpaid') {
//       alert("Order unpaid.");
//     } else if (type === 'partiallypaid') {
//       alert("Order partially paid.");
//     } else if (type === 'returned') {
//       alert("Item returned.");
//     }
//     setModalType(null);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Bug report submitted.");
//   };

//   return (
//     <div className="report-bug-container shadow-sm">
//       <h4>Report A Bug</h4>

//       <Form onSubmit={handleSubmit}>
//         {/* Email */}
//         <Form.Group className="mb-3">
//           <Form.Label className="required">Your Email</Form.Label>
//           <Form.Control type="email" placeholder="you@example.com" required />
//         </Form.Group>

//         {/* Bug Types */}
//         <Form.Group className="mb-4">
//           <Form.Label className="required">Reason for reporting this bug?</Form.Label>
//           <div className="tag-group">
//             {bugTypes.map((type) => (
//               <div
//                 key={type}
//                 className={`tag ${selectedBug === type ? 'active' : ''}`}
//                 onClick={() => setSelectedBug(type)}
//               >
//                 {type}
//               </div>
//             ))}
//           </div>
//         </Form.Group>

//         {/* Description */}
//         <Form.Group className="mb-4">
//           <Form.Label className="required">
//             Can you provide clarity on the issue? Help us understand
//           </Form.Label>
//           <Form.Control as="textarea" rows={5} required />
//         </Form.Group>

//         {/* Priority */}
//         <Form.Group className="mb-4">
//           <Form.Label>Bug Priority</Form.Label>
//           <div className="priority-group">
//             {priorities.map((level) => {
//               const priorityClass = level.toLowerCase().split(' ')[0];
//               const isActive = level === selectedPriority ? ' active' : '';
//               return (
//                 <div
//                   key={level}
//                   className={`priority-btn ${priorityClass}${isActive}`}
//                   onClick={() => setSelectedPriority(level)}
//                 >
//                   {level}
//                 </div>
//               );
//             })}
//           </div>
//         </Form.Group>

//         {/* Upload Files */}
//         <Form.Group className="mb-4">
//           <Form.Label className="required">Attach files</Form.Label>
//           <div className="upload-container">
//             <label className="upload-box">
//               <input type="file" />
//               <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
//               <p>Attach screenshots, screen recordings, or any other relevant files that illustrate the bug.</p>
//             </label>
//             <div className="file-preview">
//               {/* File previews can be rendered here */}
//             </div>
//           </div>
//         </Form.Group>

//         {/* Actions */}
//         <div className="action-buttons mt-3">
//           <button type="button" className="cancel-btn">Cancel</button>
//           <button type="submit" className="submit-btn">Submit Report</button>
//           <button type="button" onClick={() => setModalType('cancel')}>Cancel Order</button>
//           <button type="button" onClick={() => setModalType('confirm')}>Confirm Order</button>
//           <button type="button" onClick={() => setModalType('manufactured')}>Manufactured</button>
//           <button type="button" onClick={() => setModalType('shipped')}>Shipped</button>
//           <button type="button" onClick={() => setModalType('delivered')}>Delivered</button>
//           <button type="button" onClick={() => setModalType('paid')}>Paid</button>
//           <button type="button" onClick={() => setModalType('unpaid')}>Unpaid</button>
//           <button type="button" onClick={() => setModalType('partiallypaid')}>Partiallypaid</button>
//           <button type="button" onClick={() => setModalType('returned')}>Return</button>







//         </div>
//       </Form>

//       {/* Cancel Order Modal */}
//       <ModalCancelOrder
//         isOpen={modalType === 'cancel'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('cancel')}
//       />

//       {/* Confirm Order Modal */}
//       <ModalConfirmOrder
//         isOpen={modalType === 'confirm'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('confirm')}
//       />

//       {/* Manufactured Order Modal */}
//       <ModalManufactureOrder
//         isOpen={modalType === 'manufactured'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('manufactured')}
//       />

      
//       {/* Shipped Order Modal */}
//       <ModalShipOrder
//         isOpen={modalType === 'shipped'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('shipped')}
//       />

       
//       {/* Delivered Order Modal */}
//       <ModalDeliverOrder
//         isOpen={modalType === 'delivered'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('delivered')}
//       />
       
//       {/* Paid Order Modal */}
//       <ModalPaid
//         isOpen={modalType === 'paid'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('paid')}
//       />

//       {/* Paid Order Modal */}
//       <ModalUnpaid
//         isOpen={modalType === 'unpaid'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('unpaid')}
//       />

//       {/* Paid Order Modal */}
//       <ModalPartiallypaid
//         isOpen={modalType === 'partiallypaid'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('partiallypaid')}
//       />

//         {/* Paid Order Modal */}
//         <ModalReturnOrder
//         isOpen={modalType === 'returned'}
//         onCancel={() => setModalType(null)}
//         onConfirm={() => handleConfirm('returned')}
//       />
//     </div>
//   );
// };

// export default ReportBug;
