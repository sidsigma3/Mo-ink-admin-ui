import React,{useState,useEffect} from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import StatusFilter from '../../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import SearchBox from '../../../../components/SearchBox/SearchBox';
import "./AddSegmentsPage.css"
import ModalCustomerList from '../../../../components/Modal/ModalCustomerList';
import { RxCross2 } from "react-icons/rx";
import { GoDotFill } from "react-icons/go";
import { Dropdown } from 'react-bootstrap';
import FilterConditions from '../../../../components/CreateCondition/FilterConditions';
import AddBtn from '../../../../components/Buttons/Add/AddBtn';
import DeleteBtn from '../../../../components/Buttons/Delete/DeleteBtn';
import { useSegments } from '../../../../components/Context/SegmentsContext';
import { useLocation } from 'react-router-dom';
import SubmitBtn from '../../../../components/Buttons/Submit/SubmitBtn';
import { addSegment, deleteSegment, updateSegment } from '../../../../services/SegmentService';
import { getAllCustomer } from '../../../../services/CustomerService';
import StatusInput from '../../../../components/StatusInput/StatusInput';

const AddSegmentsPage = () => {

    const navigate = useNavigate ()

    const { state } = useLocation();

    const { rows, setRows } = useSegments();

    const {index ,segments} = state || {}

    const segment = state?.index !== undefined ? segments[index] : null;

    const [segmentData, setSegmentData] = useState({
      title: segment?.segmentTitle || "",
      segmentType: segment?.segmentType || "Label",
      conditions: segment?.segmentType === 'LABEL' 
          ? [] 
          : segment?.segmentCondition 
              ? JSON.parse(segment.segmentCondition) 
              : [{ field: '', operator: '', value: '', period: '', chips: [], searchResults: [] }],
      status: segment?.segmentStatus.toLowerCase() || "Active",
  });
  
  console.log(segmentData)
    

    const [showModalCustomer, setShowModalCustomer] = useState(false);
   
    const [customers,setCustomer] = useState([])
     
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getAllCustomer();
          setCustomer(data.data)
          
        } catch (error) {
          console.error('Error fetching Customers:', error);
        }
      };
    
        fetchData(); 
      }, []); 

    useEffect(() => {
      if (segmentData.segmentType.toUpperCase() === "AUTOMATED") {
          const matchedCustomers = filterCustomersByConditions(customers, segmentData.conditions);
          setSelectedCustomer(matchedCustomers);
      }
  }, [segmentData.conditions, segmentData.segmentType]);


  const [selectedCustomer, setSelectedCustomer] = useState([]);

  useEffect(() => {
    if (segment?.customers && customers.length > 0) {
      const matchedCustomers = segment.customers.map(customer => {
        const fullDetails = customers.find(c => c.customerId === customer.customerId);
        return fullDetails || customer;
      });
      setSelectedCustomer(matchedCustomers);
    }
  }, [segment, customers]);

 
  console.log(selectedCustomer)
    const handleCustomerAdd = (list) =>{
        setSelectedCustomer(list)
        
      }

      const handleDeleteCustomer = (index) =>{
        const updated = selectedCustomer.filter((item,ix) => ix != index );
        setSelectedCustomer(updated)
      }
    

      const handleTitleChange = (e) => {
        setSegmentData((prev) => ({ ...prev, title: e.target.value }));
      };
    
     
      const handleSegmentTypeChange = (e) => {
        setSegmentData((prev) => ({ ...prev, segmentType: e.target.id }));
      };

      const handleAppliesToChange = (value) => {
        setSegmentData((prev) => ({ ...prev, appliesTo: value }));
      };
    
    
      const handleConditionsChange = (newConditions) => {
        setSegmentData((prev) => ({ ...prev, conditions: newConditions }));
      };


      const filterCustomersByConditions = (customers, conditions) => {
        return customers.filter(customer => {
            return conditions.every(condition => {
                if (condition.field === "City" && condition.chips.length > 0) {
                    return condition.chips.includes(customer.city);
                }
                if (condition.field === "State" && condition.chips.length > 0) {
                    return condition.chips.includes(customer.state);
                }
                return true; 
            });
        });
    };

    const [errors, setErrors] = useState({});

    const handleSave = async () => {
        let validationErrors = {};
    
        // Basic Validations
        if (!segmentData.title?.trim()) {
            validationErrors.title = "Segment title is required";
        }
    
        if (!segmentData.segmentType) {
            validationErrors.segmentType = "Segment type is required";
        }
    
        if (
            segmentData.segmentType.toUpperCase() === "LABEL" && 
            selectedCustomer.length === 0
        ) {
            validationErrors.selectedCustomer = "At least one customer must be selected";
        }
    
        if (
            segmentData.segmentType.toUpperCase() !== "LABEL" && 
            (!segmentData.conditions || Object.keys(segmentData.conditions).length === 0)
        ) {
            validationErrors.conditions = "At least one condition must be added";
        }
    
        // If there are errors, stop execution
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        let customerIds = [];
        let segmentCondition = "";
    
        if (segmentData.segmentType.toUpperCase() === "LABEL") {
            customerIds = selectedCustomer.map(item => item.customerId);
            segmentCondition = "Selected Customers";
        } else {
            const matchingCustomers = filterCustomersByConditions(customers, segmentData.conditions);
            customerIds = matchingCustomers.map(customer => customer.customerId);
            segmentCondition = JSON.stringify(segmentData.conditions);
        }
    
        const newSegment = {
            segmentTitle: segmentData.title,
            segmentType: segmentData.segmentType.toUpperCase(),
            segmentCondition,
            segmentStatus: segmentData.status.toUpperCase(),
            customerIds: customerIds,
        };
    
        try {
            if (state?.index !== undefined) {
                await updateSegment(segment.segmentId, newSegment);
            } else {
                await addSegment(newSegment);
            }
            navigate('/segments');
        } catch (error) {
            console.error("Error saving segment:", error);
        }
    };
    
      const handleStatusChange = (status) => {
        setSegmentData((prevData) => ({
          ...prevData,      
          status: status     
        }));
       

      };
      
     const handleDelete = async() =>{
        const confirmed = window.confirm("Are you sure you want to delete this Segment?");
        if (!confirmed) return;

        try {
            const id = segment.segmentId
            await deleteSegment(id)
            navigate('/segments'); 
        } catch (error) {
            
            console.error('Error Deleting Segment:', error);
        }
     }

  return (
    <div className='add-segments-page'>
         <div className='top d-flex gap-3 align-items-center mt-2 mb-4 ' style={{ cursor: "pointer" }}>
        <span onClick={() => navigate("/segments")}>
          <IoArrowBackOutline size={25} />
        </span>
        <h3 className='m-0' style={{fontSize:'1.2rem'}}>New Segments</h3>
      </div>

        <div className='main d-flex gap-3 mt-2'>
            <div className='left'>
                    <div className='title-sec bg-white p-3 d-flex flex-column rounded'>
                        <h5 className='fs-6'>Title</h5>
                        <input type="text" value={segmentData.title} onChange={handleTitleChange} />
                        {errors.title && <p className="text-danger">{errors.title}</p>}
                    </div>

                    <div className='seg-type p-3 bg-white mt-2 rounded'>
                        <h5 className='fs-6'>Segment type</h5>
                        <div className='bg-white p-2 mt-2'>
                            <div className='d-flex gap-2'>
                                <input
                                type="radio"
                                name="segmentType"
                                id="Label"
                                checked={segmentData.segmentType.toLowerCase() === "label"}
                                onChange={handleSegmentTypeChange}
                                />
                                <label htmlFor='label' className='fw-medium'>Label</label>
                            </div>
                            <p className='fs-6 ms-4 mt-1 text-body-tertiary'>
                                Add customer to the segment one by one
                            </p>
                        </div>

                        <div className='bg-white p-2'>
                            <div className='d-flex gap-2'>
                                 <input
                                    type="radio"
                                    name="segmentType"
                                    id="Automated"
                                    checked={segmentData.segmentType.toLowerCase() === "automated"}
                                    onChange={handleSegmentTypeChange}
                                    disabled={true}
                                />
                                <label htmlFor='Automated' className='fw-medium'>Conditional</label>
                            </div>
                            <p className='fs-6 ms-4 mt-1 text-body-tertiary'>
                                Existing and future customers that match the condition you set will automatically be added to this segment
                            </p>
                        </div>

                        {errors.segmentType && <p className="text-danger">{errors.segmentType}</p>}

                    </div>


                <ModalCustomerList
                    show={showModalCustomer}
                    handleClose={() => setShowModalCustomer(false)}
                    // products={products}
                    // addToCart={addToCart}
                    customers = {customers}
                    onCustomerAdd={handleCustomerAdd}
                    preSelectedCustomers={selectedCustomer} 
                ></ModalCustomerList>


                {segmentData.segmentType.toLowerCase() === "label" && (
                    <div className='bg-white p-3 mt-2 rounded label-sec'>
                    <h5 className='fs-6'>Applies to</h5>
                    <div className="d-flex gap-2 mb-3 mt-3 align-items-center">
                    <SearchBox></SearchBox>
                    <div>
                    <button
                        className="btn-primary-custom"
                        onClick={() => setShowModalCustomer(true)}
                    >
                        Browse
                    </button>
                    </div>
                   
                </div>
                {errors.selectedCustomer && <p className="text-danger">{errors.selectedCustomer}</p>}
                <div className="customer-list-ctn ">
                <ul className="list-unstyled mb-0">
                    {selectedCustomer.length === 0 ? (
                    <li className="text-center py-4 text-muted">
                        <small>No customers selected</small>
                    </li>
                    ) : (
                    selectedCustomer.map((item, index) => (
                        <li 
                        key={index} 
                        className="bg-white rounded-3 p-3 mb-2 border border-light overflow-hidden"
                        style={{
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        >
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3 flex-grow-1 min-width-0">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg,rgb(194, 205, 255) 0%, #6B21A8 100%)',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white'
                                }}
                            >
                                {item.customerName.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="flex-grow-1 min-width-0">
                                <div className="flex-row align-items-center gap-2">
                                <h5 className="mb-0 fw-semibold text-dark text-truncate" style={{ fontSize: '16px' }}>
                                    {item.customerName}
                                </h5>
                                {/* <div 
                                    className="bg-secondary rounded-circle flex-shrink-0"
                                    style={{ width: '4px', height: '4px', opacity: '0.6' }}
                                ></div> */}
                                <p className="mb-0 text-muted text-truncate" style={{ fontSize: '16px' }}>
                                    {item.email}
                                </p>
                                </div>
                            </div>
                            </div>
                            
                            <button
                            className="btn btn-sm border-0 bg-transparent p-0 ms-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                            onClick={() => handleDeleteCustomer(index)}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease-in-out',
                                color: '#6c757d'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.color = '#dc3545';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#6c757d';
                            }}
                            aria-label={`Remove ${item.customerName}`}
                            >
                            <RxCross2 size={16} />
                            </button>
                        </div>
                        </li>
                    ))
                    )}
                </ul>
                </div>
                </div>
                )}
                    
                    {segmentData.segmentType.toLowerCase() === "automated" && (
                    <div className='bg-white p-3 mt-2 rounded'>
                        <h5>Conditions</h5>

                        <FilterConditions 
                          onConditionsChange={handleConditionsChange}
                          condition = {segmentData?.conditions}
                        >
                        </FilterConditions>
                        {errors.conditions && <p className="text-danger">{errors.conditions}</p>}
                    </div>
                    )}


                <div className="d-flex justify-content-between my-4">
                    <DeleteBtn clickFunction={handleDelete}></DeleteBtn>

                    {state?.index === undefined &&(
                    <SubmitBtn clickFunction={handleSave} text={"Add"}></SubmitBtn>
                    )}

                    {state?.index !== undefined &&(
                        <SubmitBtn clickFunction={handleSave} text={"Save"}></SubmitBtn>
                    )}

                </div>

            </div>


            <div className='right'>
                <div className='bg-white p-3 rounded'>
                    <h5 class="mb-3">Status</h5>
                    <StatusInput status={segmentData.status} onStatusChange={handleStatusChange}></StatusInput>
                </div>
            </div>


        </div>

    </div>
  )
}

export default AddSegmentsPage