import React, { useState } from 'react'
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


const AddCustomerPage = () => {

  const { state } = useLocation();
  const { rows, setRows } = useSegments();
  const navigate =useNavigate()
  const { customers ,setCustomers } = useCustomerContext();

  const [amount, setAmount] = useState(""); // Amount input

  const customer = state?.index !== undefined ? customers[state.index] : null;

  const [status,setStatus] = useState(customer?.status || 'Active')

  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    language: customer?.language || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    company: customer?.company || "",
    gstin: customer?.gstin || "",
    chequePhoto: null,
    address: customer?.address || "",
    apartment: customer?.apartment || "",
    country: customer?.country || "",
    state: customer?.state || "",
    city: customer?.city || "",
    pinCode: customer?.pinCode || "",
    
  });


  const [selectedSegments, setSelectedSegments] = useState(customer?.segment || []);  // State to track selected segments
  const [searchTerm, setSearchTerm] = useState('');  // State for input field

  // Filter segments based on the search term
  const filteredSegments = rows.filter((segment) =>
    segment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add segment to selected chips
  const addSegmentAsChip = (segment) => {
    if (!selectedSegments.includes(segment)) {
      setSelectedSegments([...selectedSegments, segment]);
    }
  };

  // Remove segment chip
  const removeSegmentChip = (index) => {
    const updatedSelectedSegments = selectedSegments.filter((_, i) => i !== index);
    setSelectedSegments(updatedSelectedSegments);
  };

  const handleStatusChange = (stat) =>{
     setStatus(stat)
  }


 

   const handleAddMoney = () => {
    if (!amount || isNaN(amount)) return alert("Enter a valid amount.");

    const updatedCustomers = [...customers];
    const customer = updatedCustomers[state?.index];

    customer.wallet = `₹${parseInt(customer.wallet.replace(/[₹,]/g, "")) + parseInt(amount)}`;
    customer.purchaseData.push({
      source: "Admin",
      type: "Credit",
      amount: `₹${amount}`,
      date: new Date().toISOString().split("T")[0],
    });

    setCustomers(updatedCustomers);
    setAmount("");
  };

  const handleSubtractMoney = () => {
    if (!amount || isNaN(amount)) return alert("Enter a valid amount.");

    const updatedCustomers = [...customers];
    const customer = updatedCustomers[state?.index];
    const currentWallet = parseInt(customer.wallet.replace(/[₹,]/g, ""));

    if (currentWallet < amount) return alert("Insufficient balance.");

    customer.wallet = `₹${currentWallet - parseInt(amount)}`;
    customer.purchaseData.push({
      source: "Admin",
      type: "Debit",
      amount: `₹${amount}`,
      date: new Date().toISOString().split("T")[0],
    });

    setCustomers(updatedCustomers);
    setAmount("");
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Handle file input separately
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

      if (state?.index !== undefined) {

        const newCustomer = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            location: formData.city,
            lastOrder: "N/A", 
            status,
            totalOrders:0,
            wallet:customer.wallet,
            purchaseData:customer.purchaseData,
            segment:selectedSegments,
            ...formData,
          };
      
        const updatedCustomers = [...customers];
        updatedCustomers[state?.index] = newCustomer; // Update the customer at the specified index
        setCustomers(updatedCustomers);
      } else {

        const newCustomer = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            wallet: "₹0", // Default wallet value
            location: formData.city,
            lastOrder: "N/A", 
            purchaseData: [],
            status,
            totalOrders:0,
            ...formData,
          };
        // Adding a new customer
        setCustomers([newCustomer, ...customers]);
      }

     
    
      // Add the new customer to the array
   
      navigate('/customers')
};


  return (
    <div className='add-customer'>
      <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
        <span onClick={() => navigate("/customers")}>
          <IoArrowBackOutline size={25} />
        </span>
        <h5>New Customer</h5>
      </div>

        <div className='main d-flex gap-3'>

            <div className='left'>

                <div className='customer-overview row bg-white p-3 gy-2 rounded'>
                <div className="col-md-6 d-flex flex-column">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Language</label>
                    <input type="text" name="language" value={formData.language} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Phone No.</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="col-md-12 d-flex flex-column">
                    <label>Email</label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} />
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
                </div>

                <div className="media-input-ctn mt-5 p-2 col-md-12">
                    <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
                    <input type="file" name="chequePhoto" onChange={handleChange} />
                    <h4>Add photo of cancelled cheque</h4>
                    </div>
                </div>

                <div className="col-md-12 d-flex flex-column">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>

                <div className="col-md-12 d-flex flex-column">
                    <label>Apartment, Suite, etc.</label>
                    <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>Country/Region</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>PIN code</label>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />
                </div>



                </div>


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
                        <AddBtn clickFunction={handleAddMoney}></AddBtn>
                        
                        <button className='btn btn-danger d-flex align-items-cneter px-3' style={{height:'1.8rem'}} onClick={handleSubtractMoney}>
                        <FaMinus size={12}/>
                        </button>
                        </div>
                    </div>
                  


                   
                    <div className="table-ctn">
                        {customers[state?.index]?.purchaseData?.length > 0 ? (
                        <Table>
                            <thead>
                            <tr>
                                {Object.keys(customers[state?.index].purchaseData[0]).map((key) => (
                                <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {customers[state?.index].purchaseData.map((item, ix) => (
                                <tr key={ix}>
                                <td>{item.source}</td>
                                <td
                                    style={{
                                    color: item.type === "Credit" ? "#3CAA82" : "#FF0000",
                                    }}
                                >
                                    {item.type}
                                </td>
                                <td>{item.amount}</td>
                                <td>{item.date}</td>
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


                    <div className='d-flex justify-content-between mt-2'>
                        <DeleteBtn></DeleteBtn>
                        <AddBtn text={'Save'} clickFunction={handleSubmit}></AddBtn>
                    </div>

            </div>


            <div className='right'>
            <div className='bg-white p-3 rounded'>
                <h5>Status</h5>
                <StatusFilter status={status} onStatusChange={handleStatusChange}></StatusFilter>
            </div>

            <div className='bg-white p-3 rounded mt-2'>
                    <div className='d-flex gap-3 border-bottom'>
                    <div className="d-flex gap-3 position-relative" style={{ width: '100px', height: '100px' }}>
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle
                            cx="50"
                            cy="50"
                            r="35"
                            stroke="#B9C0CD"
                            stroke-width="5"
                            fill="none"
                            stroke-dasharray="240"
                            stroke-dashoffset="70"
                            />
                        </svg>

                        {/* Icon in the center */}
                        <div
                            className="position-absolute d-flex justify-content-center align-items-center text-secondary"
                            style={{ top: 0, left: 0, width: '100%', height: '100%' }}
                        >
                            <VscCreditCard size={30} />
                        </div>
                        </div>


                        <div>
                            <h5>Wallet Balance</h5>
                            <h5 className='text-secondary fs-3 mt-3'>{customer?.wallet || 0 }</h5>
                        </div>
                    </div>
            </div>

            <div className="bg-white p-3 rounded mt-2">
                <h5>Segments</h5>
                
                {/* Searchable input to filter segments */}
                <input
                    className="border border-secondary-subtle rounded p-1 w-100 mb-2"
                    type="text"
                    placeholder="Search Segments"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {/* Display filtered segments to select from */}
                <div className="filtered-segments">
                    {filteredSegments.map((segment, index) => (
                    <div
                        key={index}
                        className="segment-item"
                        onClick={() => addSegmentAsChip(segment)}  // Add segment as chip when clicked
                        style={{ cursor: 'pointer', padding: '5px', border: '1px solid #ccc', margin: '5px' }}
                    >
                        {segment.title}
                    </div>
                    ))}
                </div>

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
                        }}
                    >
                        {segment.title}
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



            </div>

        </div>




    </div>
  )
}

export default AddCustomerPage