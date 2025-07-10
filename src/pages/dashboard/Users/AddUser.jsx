import React ,{useState} from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import "./AddUser.css"
import { Dropdown } from 'react-bootstrap';
import { FiShoppingCart } from "react-icons/fi";
import { addUser, updateUser , deleteUser} from '../../../services/UserService';
import DeleteBtn from '../../../components/Buttons/Delete/DeleteBtn';
import SubmitBtn from '../../../components/Buttons/Submit/SubmitBtn';
import StatusInput from '../../../components/StatusInput/StatusInput';
import Toast from '../../../components/Toast/Toast';
import { uploadProductImage } from '../../../services/ProductService';
import { activeNewUser } from '../../../services/UserService';
import SelectState from '../../../components/SelectState/SelectState';
import StatusChangeModal from '../../../components/Modal/StatusChangeModal';
import ModalDeleteUser from '../../../components/Modal/ModalDeleteUser';

const AddUser = () => {
    const backendUrl = process.env.REACT_APP_IMAGE_URL
    const {state} = useLocation()
    const { index, users} = state || {};
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const isViewMode = !!state

    const master = JSON.parse(localStorage.getItem('userData'))
    const customer = state?.index !== undefined ? users[index] : null;

    const isOwnAccount = master?.userId === customer?.userId;
    const isMaster = master?.role?.toUpperCase() === "MASTER";
    const targetIsMaster = customer?.role?.toUpperCase() === "MASTER";

    const canDelete = isViewMode && customer?.role?.toUpperCase() !== "ADMIN" && customer?.role?.toUpperCase() !== "MASTER";
    const canEdit = isOwnAccount || (isMaster && !targetIsMaster);


   
    
    const [formData, setFormData] = useState({
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        whatsapp: customer?.whatsappNumber || "",
        phone: customer?.phoneNumber || "",
        email: customer?.email || "",
        company: customer?.company || "",
        adharNumber: customer?.aadhaarNumber || "",
        chequePhoto: customer?.aadhaarDocumentUploadLink || "",
        address: customer?.userAddress || "",
        apartment: customer?.street || "",
        country: customer?.country || "",
        state: customer?.state || "",
        city: customer?.city || "",
        pinCode: customer?.zipcode || "",
        status:customer?.userStatus.toLowerCase() || "ACTIVE",
        role:customer?.role || 'SALES',
      });
    

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
          ...formData,
          [name]: files ? files[0] : value, // Handle file input separately
        });
      };
    

      const handleRole = (selectedRole) => {
        setFormData(prev => ({
            ...prev,
            role: selectedRole // Update role with selected value
        }));
    };
    

    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canEdit) {
            showToast("You are not authorized to edit this user", "error");
            return;
        }
    
        let validationErrors = {};
    
        // Basic field validations
        if (!formData.firstName.trim()) validationErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) validationErrors.lastName = "Last name is required";
        if (!formData.email.trim()) validationErrors.email = "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) validationErrors.email = "Invalid email format";
        if (!formData.phone.trim()) validationErrors.phone = "Phone number is required";
        if (!/^\d{10}$/.test(formData.phone)) validationErrors.phone = "Phone number must be 10 digits";
        if (!formData.whatsapp.trim()) validationErrors.whatsapp = "WhatsApp number is required";
        if (!/^\d{10}$/.test(formData.whatsapp)) validationErrors.whatsapp = "WhatsApp number must be 10 digits";
        // if (!formData.pinCode.trim()) validationErrors.pinCode = "PIN Code is required";
        // if (!/^\d{6}$/.test(formData.pinCode)) validationErrors.pinCode = "PIN Code must be 6 digits";
        // if (!formData.password.trim()) validationErrors.password = "Password is required";
        if (!formData.company.trim()) validationErrors.company = "Comapany is required";
        // if (!formData.address.trim()) validationErrors.address = "Address is required";
        if (!formData.adharNumber.trim()) validationErrors.adharNumber = "Addhar is required";
        // if (!formData.country.trim()) validationErrors.country = "Country is required";
        // if (!formData.state.trim()) validationErrors.state = "State is required";
        // if (!formData.city.trim()) validationErrors.city = "City is required";
        // if (!formData.apartment.trim()) validationErrors.apartment = "Street/Apartment is required";

    
        // If errors exist, stop submission
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

    
    
        const newUser = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            whatsappNumber: formData.whatsapp,
            aadhaarNumber:formData.adharNumber,
            phoneNumber: formData.phone,
            userAddress: formData.address, // Fixed duplicate key issue
            userStatus: formData.status.toUpperCase(),
            zipcode: formData.pinCode,
            street: formData.apartment,
            aadhaarDocumentUploadLink:formData.chequePhoto,
            ...formData,
        };
    
        try {
            if (state?.index !== undefined) {
                await updateUser(customer?.userId, newUser);
                const localUser = JSON.parse(localStorage.getItem("userData"));

                if (localUser?.userId === customer?.userId) {
                    const updatedUser = {
                        ...localUser,
                        ...newUser,
                        userId: localUser.userId, // Make sure to preserve the userId
                    };

                    localStorage.setItem("userData", JSON.stringify(updatedUser));
                }
            } else {
                await addUser(newUser);
            showToast(
                "Mail has been sent to Master admin for approval. You can access your account post approval",
                "success"
            );
            }
            setTimeout(() => {
                navigate('/users');
            }, 3000);
           
        } catch (error) {
            console.error("Error submitting user:", error);
            showToast(error.response.data.message,'erorr')
        }
    };


    const handleDelete = (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
        };

        const confirmDelete = async () => {
        try {
            await deleteUser(userToDelete);
            showToast("User deleted successfully!", "success");
            navigate("/users");
        } catch (error) {
            showToast("Failed to delete user.", "error");
        } finally {
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
        };

       const handleChequePhotoChange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
      
                try {
                  const res = await uploadProductImage(file,"user"); // Implement this backend uploader
                  const uploadedUrl = res.data;
      
                  setFormData((prev) => ({
                    ...prev,
                    chequePhoto: uploadedUrl,
                  }));
                } catch (error) {
                  showToast('Cheque photo upload failed. Please try again.', 'error');
                }
        };

        const handleStatusChange = (newStatus) => {
            setPendingStatus(newStatus);
            setModalOpen(true); // show modal
        };

    const confirmStatusChange = async () => {
        if (!canEdit) {
        showToast("Not authorized to change status", "error");
        return;
        }


        setModalOpen(false);

        if (formData.status.toUpperCase() === "PENDING") {
        try {
            setIsLoading(true);
            const res = await activeNewUser(customer.userId, master.userId);
            setFormData((prev) => ({ ...prev, status: pendingStatus }));
            showToast("User access granted", "success");
        } catch (err) {
            showToast("Unable to grant access", "error");
        } finally {
            setIsLoading(false);
        }
        } else {
        setFormData((prev) => ({ ...prev, status: pendingStatus }));
        showToast("Status changed successfully", "success");
        }
    };


           const showToast = (message, type = "error") => {
                setToasts([{ message, type }]);
                setTimeout(() => setToasts([]), 3000);
            };


  return (
    <div className='add-user'>

        {state?.index !== undefined ? (
             <div className='d-flex gap-3 align-items-center mb-3'> 
                 <span onClick={() => navigate("/users")}>
                 <IoArrowBackOutline size={25} />
                 </span>
             <h4 className="m-0" style={{fontSize:'1.2rem'}}>{formData.firstName + " "+formData.lastName}</h4>
             <div
                     style={{
                         width: '5rem',
                         border: '1px solid',
                         borderRadius: '0.2rem',
                         padding: '0.2rem 0.5rem',
                         textAlign: 'center',
                         fontSize:'0.9rem',
                         backgroundColor:
                             formData.role.toLowerCase() === 'owner'
                             ? '#FEDBDC'
                             :  formData.role.toLowerCase() === 'admin'
                             ? '#DBEAFE'
                             :  formData.role.toLowerCase() === 'sales'
                             ? '#FFECFA'
                             : '#FFFFFF', // Default background color if none match
                         borderColor:
                             formData.role.toLowerCase() === 'owner'
                             ? '#FD9395'
                             :  formData.role.toLowerCase() === 'admin'
                             ? '#93C5FD'
                             :  formData.role.toLowerCase() === 'sales'
                             ? '#F75FFF'
                             : '#CCCCCC', // Default border color if none match
                         color:
                             formData.role.toLowerCase() === 'owner'
                             ? '#B91C1C' // Red text for Owner
                             :  formData.role.toLowerCase() === 'admin'
                             ? '#1E40AF' // Blue text for Admin
                             :  formData.role.toLowerCase() === 'sales'
                             ? '#7A1E7A' // Purple text for Sales
                             : '#000000', // Default text color if none match
                         }}
                 >
                     {
                         formData.role}
                         </div>
         </div>
        ):
        (
        <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
         <span onClick={() => navigate("/users")}>
          <IoArrowBackOutline size={25} />
            </span>
            <h5>New User</h5>
        </div>
        )}

        
        <StatusChangeModal
            isOpen={modalOpen}
            newStatus={pendingStatus}
            onCancel={() => setModalOpen(false)}
              onConfirm={confirmStatusChange}
        ></StatusChangeModal>

      <div className='bottom d-flex gap-3'>
        <div className='left'>
        <div className='customer-overview rounded row bg-white p-2 gy-2'>
            <div className="col-6 d-flex gx-4 flex-column">
                <label>First Name <span style={{ color: 'red' }}>*</span> </label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                {formErrors.firstName && <div className="invalid-feedback d-block">{formErrors.firstName}</div>}
            </div>

            <div className="col-6 d-flex gx-4 flex-column">
                <label>Last Name <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                {formErrors.lastName && <div className="invalid-feedback d-block">{formErrors.lastName}</div>}
            </div>

            <div className="col-6 d-flex gx-4 flex-column">
                <label>WhatsApp No. <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} disabled = {isViewMode}/>
                {formErrors.whatsapp && <div className="invalid-feedback d-block">{formErrors.whatsapp}</div>}
            </div>

            <div className="col-6 d-flex gx-4 flex-column">
                <label>Calling No. <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled = {isViewMode}/>
                {formErrors.phone && <div className="invalid-feedback d-block">{formErrors.phone}</div>}
            </div>

            <div className="col-6 d-flex gx-4 flex-column">
                <label>Email <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} disabled = {isViewMode}/>
                {formErrors.email && <div className="invalid-feedback d-block">{formErrors.email}</div>}
            </div>

            {!isViewMode &&(
                 <div className="col-6 d-flex gx-4 flex-column">
                 <label>Password <span style={{ color: 'red' }}>*</span></label>
                 <input type="text" name="password" value={formData.password} onChange={handleChange} disabled = {isViewMode}/>
                 {formErrors.password && <div className="invalid-feedback d-block">{formErrors.password}</div>}
             </div>
            )}

            <div className="col-6 d-flex gx-4 flex-column">
                <label>Company <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} />
                {formErrors.company && <div className="invalid-feedback d-block">{formErrors.company}</div>}
            </div>

        <div className="col-12 my-4">
  <div className="media-upload-card p-4 h-100">
    <label className="upload-label mb-3" style={{fontSize:'1rem'}}>Aadhaar Card Photo <span style={{color:'red'}}>*</span></label>
    <div className="upload-area d-flex flex-column justify-content-center align-items-center p-4">
      <input
        type="file"
        id="aadhaar-upload"
        accept="image/*"
        onChange={handleChequePhotoChange}
        className="d-none"
      />
      <label 
        htmlFor="aadhaar-upload" 
        className="upload-button btn btn-outline-primary rounded-pill px-4 py-2 mb-2"
      >
        <i className="bi bi-cloud-arrow-up me-2"></i>Choose File
      </label>
      <p className="upload-hint text-muted mb-0">JPEG, PNG (Max 2MB)</p>
      
       {formData.chequePhoto && (
        <div className="preview-container mt-4 text-center">
          <img 
            src={`${backendUrl}${formData.chequePhoto}`} 
            alt="Cheque Preview" 
            className="img-thumbnail rounded" 
            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
          />
          {/* <button 
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={() => setFormData(prev => ({...prev, aadhaarPhoto: ''}))}
          >
            Remove
          </button> */}
        </div>
      )}
    </div>
    {formErrors.chequePhoto && (
      <p className="text-danger small mt-2 mb-0">{formErrors.chequePhoto}</p>
    )}
  </div>
</div>

            {/* <div className="media-input-ctn mt-5 p-2 col-md-12">
                <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
                <input type="file" accept="image/*"  name="chequePhoto" onChange={handleChequePhotoChange} />
                <h4>Add photo of a Aadhaar card</h4>
                </div>
                {formErrors.chequePhoto && <div className="invalid-feedback d-block">{formErrors.chequePhoto}</div>}

                {formData.chequePhoto && (
                    <div className="mt-3">
                      <img src={`${backendUrl}${formData.chequePhoto}`} alt="Cheque" width="120" />
                    </div>
                )}

            </div> */}

            <div className="col-md-12 d-flex flex-column">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
                {formErrors.address && <div className="invalid-feedback d-block">{formErrors.address}</div>}
            </div>

            <div className="col-md-12 d-flex flex-column">
                <label>Apartment, Suite, etc.</label>
                <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
                {formErrors.apartment && <div className="invalid-feedback d-block">{formErrors.apartment}</div>}
            </div>

            <div className="col-6 d-flex gx-4 flex-column">
                <label>Country/Region</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} />
                {formErrors.country && <div className="invalid-feedback d-block">{formErrors.country}</div>}
            </div>

            <div className="col-6 d-flex gx-4 flex-column">
                <label>State</label>
                {/* <input type="text" name="state" value={formData.state} onChange={handleChange} /> */}
                <SelectState value={formData.state} onChange={handleChange}></SelectState>
                {formErrors.state && <div className="invalid-feedback d-block">{formErrors.state}</div>}
            </div>

            <div className="col-6 d-flex gx-4 flex-column">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
                {formErrors.city && <div className="invalid-feedback d-block">{formErrors.city}</div>}
            </div>

            <div className="col-6 d-flex gx-4 flex-column">
                <label>PIN code</label>
                <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />
                {formErrors.pinCode && <div className="invalid-feedback d-block">{formErrors.pinCode}</div>}
            </div>



            </div>

          <div className='d-flex justify-content-between my-4'>
            {canDelete && (
                <DeleteBtn clickFunction={() => handleDelete(customer.userId)} />
            )}

            <SubmitBtn text={'Save'} clickFunction={handleSubmit} />
        </div>

        <ModalDeleteUser
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        />


    

        </div>

        <div className='right'>
            <div className='bg-white p-3 rounded'>
                <h5 className='mb-3'>Status</h5>

                <StatusInput status={formData.status} 
                  onStatusChange={handleStatusChange}
                ></StatusInput>
            </div>

      {!(targetIsMaster ) && (
        <div className='bg-white p-3 rounded mt-2'>
            <h5>Role</h5>
            <Dropdown onSelect={handleRole}>
            <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                className="d-flex align-items-center justify-content-between gap-2 w-100 mt-1"
            >
                {formData.role || "Select Role"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item eventKey="SALES">Sales</Dropdown.Item>
                <Dropdown.Item eventKey="ADMIN">Admin</Dropdown.Item>
                {isMaster || !isViewMode && (
                <Dropdown.Item eventKey="MASTER">Master Admin</Dropdown.Item>
                )}
            </Dropdown.Menu>
            </Dropdown>
        </div>
        )}



           
        </div>

      </div>
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
  )
}

export default AddUser