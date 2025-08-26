import React ,{useState, useRef } from 'react'
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
import { Download, Link, X, Camera } from 'lucide-react';


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
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
   
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
        adharNumber: customer?.aadhaar?.aadhaarNumber || "",
        aadhaarPhotos: [
            customer?.aadhaar?.aadhaarDocumentUploadLinkFront || "",
            customer?.aadhaar?.aadhaarDocumentUploadLinkBack || ""
        ],
        address: customer?.userAddress || "",
        apartment: customer?.street || "",
        country: customer?.country || "",
        state: customer?.state || "",
        city: customer?.city || "",
        pinCode: customer?.zipcode || "",
        status: customer?.userStatus?.toLowerCase() || "ACTIVE",
        role: customer?.role || "SALES",
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
        // if (!formData.adharNumber.trim()) validationErrors.adharNumber = "Addhar is required";
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
        phoneNumber: formData.phone,
        userAddress: formData.address,
        userStatus: formData.status.toUpperCase(),
        zipcode: formData.pinCode,
        street: formData.apartment,
        role: formData.role,
        company: formData.company,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        aadhaar: {
            aadhaarNumber: formData.adharNumber,
            aadhaarDocumentUploadLinkFront: formData.aadhaarPhotos?.[0] || "",
            aadhaarDocumentUploadLinkBack: formData.aadhaarPhotos?.[1] || ""
        }
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

        console.log(formData)

        const handleAadhaarPhotoChange = async (e, index) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const uploadedUrl = await uploadProductImage(file, "user"); 
                console.log(uploadedUrl)
                setFormData((prev) => {
                const updated = [...prev.aadhaarPhotos];
                updated[index] = uploadedUrl.data; 
                return { ...prev, aadhaarPhotos: updated };
                });
            } catch (error) {
                console.error("Error uploading Aadhaar photo:", error);
                showToast("Upload failed, please try again.", "error");
            }
        };



      const handleDownloadAadhaarPhoto = (index) => {
        if (!formData.aadhaarPhotos?.[index]) return;
        const url = `${backendUrl}${formData.aadhaarPhotos[index]}`;
        window.open(url, "_blank");
        };

    const handleCopyAadhaarLink = async (index) => {
        try {
            const imageUrl = `${backendUrl}${formData.aadhaarPhotos[index]}`;
            await navigator.clipboard.writeText(imageUrl);
            alert("Image link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy link:", err);
            alert("Failed to copy link");
        }
        };

const handleImageClick = (index) => {
  setCurrentIndex(index);
  setShowPreview(true);
};

  const handleClosePreview = () => {
    setShowPreview(false);
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

            // const handleDownloadChequePhoto = () => {
            // if (!formData.chequePhoto) {
            //     console.error("No cheque photo URL provided");
            //     return;
            // }

            // const url = `${backendUrl}${formData.chequePhoto}`;
            // window.open(url, '_blank');
            // };



  return (
    <div className='add-user'>

        {state?.index !== undefined ? (
             <div className='top d-flex gap-3 align-items-center mt-3 mb-4 '> 
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
                fontSize: '0.9rem',
                ...(formData.role.toLowerCase() === 'master' ? {
                    backgroundImage: 'linear-gradient(175deg, #F3E47E 30%, #E1A93C 100%)',
                    backgroundColor: '#F3E47E',
                    borderColor: '#E1A93C',
                    color: '#7c5d24',
                } : formData.role.toLowerCase() === 'admin' ? {
                    backgroundColor: '#DBEAFE',
                    borderColor: '#93C5FD',
                    color: '#1E40AF',
                } : formData.role.toLowerCase() === 'sales' ? {
                    backgroundColor: '#FFECFA',
                    borderColor: '#F75FFF',
                    color: '#7A1E7A',
                } : {
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CCCCCC',
                    color: '#000000',
                })
                }}
                 >
                     {
                         formData.role}
                         </div>
         </div>
        ):
        (
        <div className='top d-flex gap-3 align-items-center mt-3 mb-4 'style={{ cursor: "pointer" }}>
         <span onClick={() => navigate("/users")}>
          <IoArrowBackOutline size={25} />
            </span>
            <h3 className='m-0' style={{fontSize:'1.2rem'}}>New User</h3>
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

       <div className="row">
            {/* Aadhaar Front */}
            <div className="col-6 my-4">
                <div className="media-upload-card p-4 h-100">
                <label className="upload-label mb-3" style={{ fontSize: "1rem" }}>
                    Aadhaar Front
                </label>

                <div className="upload-area d-flex flex-column justify-content-center align-items-center p-4">
                    <input
                    type="file"
                    id="aadhaar-front-upload"
                    accept="image/*"
                    onChange={(e) => handleAadhaarPhotoChange(e, 0)}
                    className="d-none"
                    />
                    <label
                    htmlFor="aadhaar-front-upload"
                    className="upload-button btn btn-outline-custom rounded-pill px-4 py-2 mb-2"
                    >
                    <i className="bi bi-cloud-arrow-up me-2"></i>Choose Front
                    </label>
                    <p className="upload-hint text-muted mb-0">JPEG, PNG (Max 2MB)</p>

                    {formData.aadhaarPhotos?.[0] && (
                    <div className="preview-container mt-4 text-center">
                        <img
                        src={`${backendUrl}${formData.aadhaarPhotos[0]}`}
                        alt="Aadhaar Front"
                        className="img-thumbnail rounded"
                        style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "contain",
                            cursor: "pointer",
                        }}
                        onClick={()=>handleImageClick(0)}
                        />
                    </div>
                    )}
                </div>
                </div>
            </div>

            {/* Aadhaar Back */}
            <div className="col-6 my-4">
                <div className="media-upload-card p-4 h-100">
                <label className="upload-label mb-3" style={{ fontSize: "1rem" }}>
                    Aadhaar Back
                </label>

                <div className="upload-area d-flex flex-column justify-content-center align-items-center p-4">
                    <input
                    type="file"
                    id="aadhaar-back-upload"
                    accept="image/*"
                    onChange={(e) => handleAadhaarPhotoChange(e, 1)}
                    className="d-none"
                    />
                    <label
                    htmlFor="aadhaar-back-upload"
                    className="upload-button btn btn-outline-custom rounded-pill px-4 py-2 mb-2"
                    >
                    <i className="bi bi-cloud-arrow-up me-2"></i>Choose Back
                    </label>
                    <p className="upload-hint text-muted mb-0">JPEG, PNG (Max 2MB)</p>

                    {formData.aadhaarPhotos?.[1] && (
                    <div className="preview-container mt-4 text-center">
                        <img
                        src={`${backendUrl}${formData.aadhaarPhotos[1]}`}
                        alt="Aadhaar Back"
                        className="img-thumbnail rounded"
                        style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "contain",
                            cursor: "pointer",
                        }}
                        onClick={()=>handleImageClick(1)}
                        />
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>


                          {/* Preview Modal */}
                        {showPreview && (
  <div
    className="modal fade m-0 p-0 show d-block"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(4px)",
      zIndex: 2000,
    }}
    onClick={handleClosePreview}
  >
    <div
      className="modal-dialog modal-xl d-flex align-items-center justify-content-center p-3"
      style={{ maxWidth: "100vw", height: "100vh", margin: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="position-relative w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ maxWidth: "95vw", maxHeight: "95vh" }}
      >
        {/* Main Image */}
        <img
          src={`${backendUrl}${formData.aadhaarPhotos?.[currentIndex]}`}
          alt="Aadhaar Preview"
          className="img-fluid rounded-3 shadow-lg"
          style={{
            maxWidth: "100%",
            maxHeight: "85vh",
            objectFit: "contain",
            backgroundColor: "white",
            border: "2px solid rgba(255, 255, 255, 0.1)",
          }}
          onLoad={() => console.log("Image loaded successfully")}
          onError={() => console.error("Failed to load Aadhaar image")}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Action Buttons */}
        <div
          className="d-flex gap-2 position-absolute"
          style={{
            top: "20px",
            right: "20px",
            zIndex: 1070,
          }}
        >
          {/* Download */}
          <button
            type="button"
            className="btn btn-sm btn-dark rounded-circle"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadAadhaarPhoto(currentIndex);
            }}
          >
            <Download size={16} />
          </button>

          {/* Copy link */}
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyAadhaarLink(currentIndex);
            }}
          >
            <Link size={16} />
          </button>

          {/* Change photo */}
          <button
            type="button"
            className="btn btn-sm btn-success rounded-circle"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={16} />
          </button>

          {/* Close */}
          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle"
            onClick={handleClosePreview}
          >
            <X size={16} />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleAadhaarPhotoChange(e, currentIndex)}
        />
      </div>
    </div>
  </div>
)}



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

          <div className="d-flex justify-content-between my-4">
            <div>
                {canDelete && (
                <DeleteBtn clickFunction={() => handleDelete(customer.userId)} />
                )}
            </div>

            <div>
                <SubmitBtn text="Save" clickFunction={handleSubmit} />
            </div>
            </div>


        <ModalDeleteUser
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        />


    

        </div>

        <div className='right'>
           {(isMaster || !targetIsMaster) && (
            <div className='bg-white p-3 rounded'>
                <h5 className='mb-3'>Status</h5>
                <StatusInput 
                status={formData.status} 
                onStatusChange={handleStatusChange}
                />
            </div>
            )}


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