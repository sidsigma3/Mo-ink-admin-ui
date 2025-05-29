import React, { useState , useEffect } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate , useLocation} from 'react-router-dom';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import "./AddCustomerPage.css"
import AddBtn from '../../../components/Buttons/Add/AddBtn';
import { RiFilePaper2Line } from "react-icons/ri";
import DeleteBtn from '../../../components/Buttons/Delete/DeleteBtn';
import { useCustomerContext } from '../../../components/Context/CustomerContext';
import { Table } from 'react-bootstrap';
import TotalOrders from '../Analytics/Graphs/TotalOrders';
import { FaMinus } from "react-icons/fa";
import { VscCreditCard } from "react-icons/vsc";
import { useSegments } from '../../../components/Context/SegmentsContext';
import SubmitBtn from '../../../components/Buttons/Submit/SubmitBtn';
import { MdAdd } from "react-icons/md";
import { addCustomer,updateCustomer , deleteCustomer , addMoneyToWallet ,subtractMoneyFromWallet , getWalletTransactions } from '../../../services/CustomerService';
import { getAllSegment } from '../../../services/SegmentService';
import StatusInput from '../../../components/StatusInput/StatusInput';
import { FiDownload } from "react-icons/fi";
import { downloadCreditReceipt } from '../../../services/InvoiceServices';
import SelectState from '../../../components/SelectState/SelectState';
import Toast from '../../../components/Toast/Toast';
import { uploadProductImage } from '../../../services/ProductService';

const AddCustomerPage = () => {
const backendUrl = process.env.REACT_APP_IMAGE_URL
  const { state } = useLocation();
  const { index, customers } = state || {};
  const { rows, setRows } = useSegments();
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);

  const [selectedAddressType, setSelectedAddressType] = useState("HOME");

  const navigate =useNavigate()
  // const { customers ,setCustomers } = useCustomerContext();
  const [segments,setSegments] = useState([])
      
  useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getAllSegment();
          setSegments(data.data)
          
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
    
      fetchData(); 
    }, []); 

  const customer =  (typeof index === 'number' && customers) ? customers[index] : null;

  const [amount, setAmount] = useState(""); // Amount input
  const [source, setSource] = useState("");


  const [status,setStatus] = useState(customer?.customerStatus || 'Active')

  const [formData, setFormData] = useState(() => {
    const nameParts = customer?.customerName?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    return {
      firstName,
      lastName,
      email: customer?.email || "",
      phone: customer?.phoneNumber || "",
      whatsapp: customer?.whatsappNumber || "",
      company: customer?.company || "",
      gstin: customer?.gstNumber || "",
      chequePhoto: null,
      address: customer?.customerAddress || "",
      street: customer?.street || "",
      country: customer?.country || "",
      state: customer?.state || "",
      city: customer?.city || "",
      pinCode: customer?.zipcode || "",
      // password: customer?.password || "",
    };
  });

  
  // Update initialFormData when customer changes
  useEffect(() => {
    if (!customer || !selectedAddressType) return;
  
    const addressOfType = customer.addresses?.find(
      addr => addr.addressType === selectedAddressType
    );
  
    const nameParts = customer?.customerName?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
  
    const updatedForm = {
      firstName,
      lastName,
      email: customer?.email || "",
      phone: customer?.phoneNumber || "",
      whatsapp: customer?.whatsappNumber || "",
      company: customer?.company || "",
      gstin: customer?.gstNumber || "",
      chequePhoto: null,
      address: addressOfType?.customerAddress || "",
      street: addressOfType?.street || "",
      country: addressOfType?.country || "",
      state: addressOfType?.state || "",
      city: addressOfType?.city || "",
      pinCode: addressOfType?.zipcode || "",
      password: customer?.password || "",
    };
  
    setFormData(updatedForm);
   
  }, [customer, selectedAddressType]);
  
  const [selectedSegments, setSelectedSegments] = useState(customer?.segments || []);
  const [searchTerm, setSearchTerm] = useState('');  // State for input field

  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletBalance,setWalletBalance] = useState()

  const fetchTransactions = async () => {
    if (customer===null) return;
   
    const customerId = customer.customerId; 
   
    setLoading(true);
    try {
     
      const data = await getWalletTransactions(customerId);
      setTransactions(data); // Update state with API response
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
    fetchTransactions();
  }, [customer]);

  

  useEffect(() => {
    if (transactions?.length > 0) {
      const total = transactions.reduce((acc, item) => {
        return item.type === "CREDIT"
          ? acc + parseFloat(item.amount)
          : acc - parseFloat(item.amount);
      }, 0); // Initial value is 0
      setWalletBalance(total);
    } else {
      setWalletBalance(0); // Set to 0 if no transactions
    }
  }, [transactions]);

  

  const filteredSegments = segments.filter((segment) =>
    segment.segmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedValue, setSelectedValue] = useState(""); // State to reset dropdown

  const addSegmentAsChip = (event) => {
    const segmentTitle = event.target.value;
    if (!segmentTitle) return;
  
    const selectedSegment = segments.find(seg => seg.segmentTitle === segmentTitle);
    
    const alreadyAdded = selectedSegments.some(
      seg => seg.segmentTitle === selectedSegment?.segmentTitle
    );
  
    if (selectedSegment && !alreadyAdded) {
      setSelectedSegments([...selectedSegments, selectedSegment]);
    }
  
    setSelectedValue("");
  };

console.log(selectedSegments)
  

const removeSegmentChip = (index) => {
  setSelectedSegments(selectedSegments.filter((_, i) => i !== index));
};
  
  const handleStatusChange = (stat) =>{
     setStatus(stat)
  }


  const handleAddMoney = async () => {
     const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
    if (!amount || isNaN(amount)) {
      return showToast("Enter a valid amount.", "error");
    }
  
    try {
      const customerId = customer.customerId;
      await addMoneyToWallet(customerId, amount, source || "Manual credit");
      fetchTransactions();
      setAmount("");
      setSource("");
      showToast("Money added successfully.", "success");
    } catch (error) {
      showToast("Failed to add money to wallet.", "error");
    }
  };

  const handleSubtractMoney = async () => {
     const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
    if (!amount || isNaN(amount)) {
      return showToast("Enter a valid amount.", "error");
    }
  
    try {
      const customerId = customer.customerId;
      await subtractMoneyFromWallet(customerId, amount, source || "Manual debit");
      fetchTransactions();
      setAmount("");
      setSource("");
      showToast("Money deducted successfully.", "success");
    } catch (error) {
      showToast("Failed to subtract money from wallet.", "error");
    }
  };

 

const handleAddressTypeChange = (e) => {
  const type = e.target.value;
  setSelectedAddressType(type);

  const selectedAddress = customer?.addresses?.find(addr => addr.addressType === type) || {};
  setFormData(prev => ({
    ...prev,
    address: selectedAddress.customerAddress || "",
    street: selectedAddress.street || "",
    country: selectedAddress.country || "",
    state: selectedAddress.state || "",
    city: selectedAddress.city || "",
    pinCode: selectedAddress.zipcode || "",
  }));
};


  const handleChange = (e) => {
    const { name, value, files } = e.target;

   
    const updatedFormData = {
        ...formData,
        [name]: files ? files[0] : value,
    };

    setFormData(updatedFormData);
   
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({}); // Reset errors

    let validationErrors = {};

    // Validate Required Fields
    if (!formData.firstName?.trim()) validationErrors.firstName = "First name is required.";
    if (!formData.lastName?.trim()) validationErrors.lastName = "Last name is required.";
    if (!formData.phone?.trim()) validationErrors.phone = "Phone number is required.";
    if (!formData.email?.trim()) validationErrors.email = "Email is required.";
    if (!formData.password?.trim()) validationErrors.password = "Password is required.";
    if (!formData.company?.trim()) validationErrors.company = "Company is required.";
    if (!formData.street?.trim()) validationErrors.street = "Apartment,Suite etc is required.";
    if (!formData.country?.trim()) validationErrors.country = "Country name is required.";
    if (!formData.state?.trim()) validationErrors.state = "State is required.";
    if (!formData.city?.trim()) validationErrors.city = "City is required.";
    if (!/^\d{10}$/.test(formData.phone)) validationErrors.phone = "Enter a valid 10-digit phone number.";
    if (!formData.whatsapp?.trim()) validationErrors.whatsapp = "WhatsApp number is required.";
    if (!/^\d{10}$/.test(formData.whatsapp)) validationErrors.whatsapp = "Enter a valid 10-digit WhatsApp number.";
    // if (!formData.gstin?.trim()) validationErrors.gstin = "GST number is required.";
    // if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[Z]{1}\d{1}$/.test(formData.gstin))
    //     validationErrors.gstin = "Enter a valid GSTIN.";
    if (!formData.pinCode?.trim()) validationErrors.pinCode = "Pincode is required.";
    if (!/^\d{6}$/.test(formData.pinCode)) validationErrors.pinCode = "Enter a valid 6-digit pincode.";
    if (!formData.address?.trim()) validationErrors.address = "Address is required.";
    // if (selectedSegments.length === 0) validationErrors.segmentIds = "Select at least one segment.";

    // Stop submission if errors exist
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    const existingAddresses = [...(customer?.addresses || [])];
    const addressIndex = existingAddresses.findIndex(
      addr => addr.addressType === selectedAddressType
    );
  
    const existingAddress = existingAddresses[addressIndex];
    const updatedAddress = {
      ...(existingAddress?.id ? { id: existingAddress.id } : {}),
      customerAddress: formData.address,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipcode: formData.pinCode,
      addressType: selectedAddressType,
    };
  
    if (addressIndex !== -1) {
      existingAddresses[addressIndex] = updatedAddress;
    } else {
      existingAddresses.push(updatedAddress);
    }
  
    const segmentIds = selectedSegments.map(segment => segment.segmentId || segment.id);
  
    const newCustomer = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      phoneNumber: formData.phone,
      whatsappNumber: formData.whatsapp,
      gstNumber: formData.gstin,
      email: formData.email,
      company: formData.company,
      cancelledCheque: formData.chequePhoto || "",
      customerStatus: status.toUpperCase(),
      segmentIds,
      addresses: existingAddresses.slice(0, 3), // enforce max 3 types
      customerAddress: formData.address,
      zipcode: formData.pinCode,
      ...(state?.index === undefined && { password: formData.password }) // only include password if creating
    };
    
    try {
      if (state?.index !== undefined) {
        // Update existing customer
        await updateCustomer(customer.customerId, newCustomer);
      
      } else {
        // Add new customer
        await addCustomer(newCustomer);
      
      }
  
      navigate('/customers'); 
    } catch (error) {
      console.error("Error saving customer:", error);
     
    }
  };

  const handleDownloadCreditReceipt = async (source) => {
    const lowerSource = source.toLowerCase();
    const isCancellation = lowerSource.includes("cancellation");
    const isReturn = lowerSource.includes("return");
  
    // Extract orderId (last number after 'order:') and optionally returnedId (number after 'item:')
    const orderIdMatch = source.match(/order:\s*(\d+)/i);
    const returnedIdMatch = source.match(/item:\s*(\d+)/i);
  
    const orderId = orderIdMatch ? orderIdMatch[1] : null;
    const returnedId = returnedIdMatch ? returnedIdMatch[1] : null;
  
    if (!orderId || (!isCancellation && !isReturn)) {
      console.error("Invalid source format:", source);
      return;
    }
  
    const type = isCancellation ? "cancelled" : "returned";
  
    try {
      if (type === "returned") {
        if (!returnedId) {
          console.error("Returned ID missing for return type");
          return;
        }
        await downloadCreditReceipt(orderId, type, returnedId);
      } else {
        await downloadCreditReceipt(orderId, type);
      }
    } catch (error) {
      console.error("Failed to download credit receipt:", error);
    }
  };
  



  const handleDelete = async() =>{
    const confirmed = window.confirm("Are you sure you want to delete this Customer?");
    if (!confirmed) return;

       try {
          const id = customer.customerId
          await deleteCustomer(id)
          navigate('/customers'); // Redirect after submission
        } catch (error) {
          // Handle error (optional)
          console.error('Error Deleting product:', error);
        }
  }


        const handleChequePhotoChange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          try {
            const res = await uploadProductImage(file,"customer"); // Implement this backend uploader
            const uploadedUrl = res.data;

            setFormData((prev) => ({
              ...prev,
              chequePhoto: uploadedUrl,
            }));
          } catch (error) {
            // showToast('Cheque photo upload failed. Please try again.', 'error');
          }
        };


 
  return (
    <div className='add-customer'>

      {state?.index !== undefined ? (
          <div className='d-flex gap-3 mb-3'> 
                    <span onClick={() => navigate("/customers")} style={{ cursor: "pointer" }}>
                    <IoArrowBackOutline size={25} />
                </span>
          <h4>{customer.customerName}</h4>
        </div>
          ):
          (
        <div className="top d-flex gap-3 mt-2" >
          <span onClick={() => navigate("/customers")} style={{ cursor: "pointer" }}>
            <IoArrowBackOutline size={25} />
          </span>
          <h4>New Customer</h4>
        </div>
        )}

        <div className='main d-flex gap-3 mt-2'>

            <div className='left'>

                <div className='customer-overview row bg-white p-3 gy-2 rounded'>
                <div className="col-md-6 d-flex flex-column">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>WhatsApp No.</label>
                    <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                    {errors.whatsapp && <p className="text-danger">{errors.whatsapp}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Calling No.</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <p className="text-danger">{errors.phone}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Email</label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Password</label>
                    <input type="text" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <p className="text-danger">{errors.password}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} />
                    {errors.company && <p className="text-danger">{errors.company}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>GSTIN No.</label>
                    <input
                    className="fs-6 ps-2"
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    placeholder="Add GSTIN No. to authenticate"
                    onChange={handleChange}
                    />
                    {errors.gstin && <p className="text-danger">{errors.gstin}</p>}
                </div>


                <div className="media-input-ctn mt-5 p-2 col-md-12">
                  <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
                    <input type="file" accept="image/*" onChange={handleChequePhotoChange} />
                    <h4>Add photo of cancelled cheque</h4>
                  </div>
                  {errors.chequePhoto && <p className="text-danger">{errors.chequePhoto}</p>}

                  {formData.chequePhoto && (
                    <div className="mt-3">
                      <img src={`${backendUrl}${formData.chequePhoto}`} alt="Cheque" width="120" />
                    </div>
                  )}
                </div>


                
                <div className='d-flex justify-content-end'>
                <div className="d-flex flex-column mb-1 w-25 gap-1">
                  <label>Address Type</label>
                  <select value={selectedAddressType} onChange={handleAddressTypeChange} className='rounded-2 p-1 border border-secondary-subtle'>
                    <option value="HOME">Home</option>
                    <option value="WORK">Work</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                </div>

                <div className="col-md-12 d-flex flex-column">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                    {errors.address && <p className="text-danger">{errors.address}</p>}
                </div>

                <div className="col-md-12 d-flex flex-column">
                    <label>Apartment, Suite, etc.</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} />
                    {errors.street && <p className="text-danger">{errors.street}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Country/Region</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} />
                    {errors.country && <p className="text-danger">{errors.country}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>State</label>
                    <SelectState value={formData.state} onChange={handleChange} />
                    {errors.state && <p className="text-danger">{errors.state}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} />
                    {errors.city && <p className="text-danger">{errors.city}</p>}
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>PIN code</label>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />
                    {errors.pinCode && <p className="text-danger">{errors.pinCode}</p>}
                </div>



                </div>


            { state &&(

                <div className='bg-white mt-2 p-3 w-100 rounded'>
                <div className='d-flex justify-content-between'>
                <h5>Manage Wallet</h5>

                {/* {manageWallet === false && (
                    <AddBtn clickFunction={handleAddWallet}></AddBtn>
                )} */}

                </div>


                <div>
                    <label>Add balance</label>
                    <div className='d-flex gap-2 mt-2'>
                    <input value={amount} onChange={(e) => setAmount(e.target.value)} className='rounded border border-secondary-subtle p-1 w-50' placeholder='₹ INR'></input>
                    {/* <AddBtn clickFunction={handleAddMoney}></AddBtn> */}
                    <input
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="rounded border border-secondary-subtle p-1 w-100"
                        placeholder="Comment / Source (e.g., Manual adjustment)"
                      />


                    <button className='btn btn-primary d-flex align-items-cneter' style={{height:'1.8rem',padding:'0.28rem 1.2rem'}} onClick={handleAddMoney}>
                    <MdAdd size={19}/>
                    </button>
                    
                    <button className='btn btn-danger d-flex align-items-cneter' style={{height:'1.8rem',padding:'0.55rem 1.2rem'}} onClick={handleSubtractMoney}>
                    <FaMinus size={12}/>
                    </button>
                    </div>
                </div>




                <div className="table-ctn">
                {loading ? (
                  <div className="py-5 text-body-tertiary d-flex flex-column justify-content-center align-items-center">
                    <span>Loading...</span>
                  </div>
                ) : transactions.length > 0 ? (
                  <Table>
                    <thead>
                      <tr>
                        <th>Source</th>
                        {/* <th className=" text-center">Invoice No.</th> */}
                        <th className=" text-center">Type</th>
                        <th className=" text-center">Amount</th>
                        <th className=" text-center">Date</th>
                        <th className=" text-center">Credit Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice().reverse().map((item, ix) => (
                        <tr key={ix}>
                          <td>{item.source}</td>
                          {/* <td className=" text-center">INV-87565</td> */}
                          <td className=" text-center"
                            style={{
                              color: item.type === "CREDIT" ? "#3CAA82" : "#FF0000",
                            }}
                          >
                            {item.type}
                          </td>

                          <td className="text-center"
                            style={{
                              color: item.type === "CREDIT" ? "#3CAA82" : "#FF0000", 
                            }}
                          >
                            {item.type === "DEBIT" ? "−" : ""}
                            ₹{item.amount.toFixed(0)} 
                          </td>
                         
                          <td className="text-center">
                            {new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                          </td>


                          {(item.source?.includes("Refund for cancellation") || item.source?.includes("Refund for return")) && (
                          <td className=" text-center pr-4">
                            <button
                            className="btn p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadCreditReceipt(item.source);
                            }}
                            >
                            <FiDownload size={20}/>
                            </button>
                          </td>
                           )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="py-5 text-body-tertiary d-flex flex-column justify-content-center align-items-center">
                    <RiFilePaper2Line size={50} />
                    <h5 className="fs-6">There's no transaction till now!</h5>
                  </div>
                )}
              </div>

                                    
                </div>
            )}

                
                    <div className='d-flex justify-content-between mt-4 mb-4'>
                        <DeleteBtn clickFunction={handleDelete}></DeleteBtn>
                        <SubmitBtn text={'Save'} clickFunction={handleSubmit}/>
                    </div>

            </div>


            <div className='right'>
            <div className='bg-white p-3 rounded'>
                <h5>Status</h5>
                <StatusInput status={status} onStatusChange={handleStatusChange}></StatusInput>
            </div>

            <div className='bg-white p-3 rounded mt-2'>
              <div className='d-flex gap-3 border-bottom'>
                  <div className="d-flex gap-3 position-relative" style={{ width: '100px', height: '100px' }}>
                      <svg width="100" height="100" viewBox="0 0 100 100">
                          <circle
                              cx="50"
                              cy="50"
                              r="35"
                              stroke={walletBalance > 0 ? "#007bff" : "#B9C0CD"} // Blue if wallet has balance
                              strokeWidth="5"
                              fill="none"
                              strokeDasharray="240"
                              strokeDashoffset="70"
                          />
                      </svg>

                      {/* Icon in the center */}
                      <div
                          className="position-absolute d-flex justify-content-center align-items-center"
                          style={{ top: 0, left: 0, width: '100%', height: '100%', color: walletBalance > 0 ? "#007bff" : "#6c757d" }}
                      >
                          <VscCreditCard size={30} />
                      </div>
                  </div>

                  <div>
                      <h5 style={{fontSize:'1.1rem'}}>Wallet Balance</h5>
                      <h5 className={`fs-4 mt-3 ${walletBalance > 0 ? 'text-primary' : 'text-secondary'}`}>
                          ₹{walletBalance?.toFixed(0) || 0}
                      </h5>
                  </div>
              </div>
          </div>


            {state?.index !== undefined && (
                <div className="bg-white p-3 rounded mt-2 segment-sec">
                <h5>Segments</h5>
                
             
                <select
                className="border border-secondary-subtle rounded p-1 w-100 mb-2"
                value={selectedValue}
                onChange={addSegmentAsChip}
            >
                <option value="">Select a Segment</option>
                {segments.map((segment, index) => (
                    <option key={index} value={segment.segmentTitle}>
                        {segment.segmentTitle}
                    </option>
                ))}
            </select>
 

                {/* Display selected segments as chips */}
                <div className="chips-container mt-2">
                    {selectedSegments.map((segment, index) => (
                    <span
                        key={index}
                        className="chip"
                        style={{
                        display: 'inline-block',
                        backgroundColor: '#e0e0e0',
                        padding: '5px 10px',
                        margin: '5px',
                        borderRadius: '20px',
                        fontSize:"0.9rem"
                        }}
                    >
                        {segment.segmentTitle}
                        <button
                        onClick={() => removeSegmentChip(index)}  // Remove chip when clicked
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'red',
                            marginLeft: '5px',
                            cursor: 'pointer',
                        }}
                        >
                        x
                        </button>
                    </span>
                    ))}
                </div>
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

export default AddCustomerPage