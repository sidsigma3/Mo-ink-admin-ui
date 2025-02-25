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
import { addSegment, updateSegment } from '../../../../services/SegmentService';
import { getAllCustomer } from '../../../../services/CustomerService';

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
      status: segment?.status || "Active",
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


    const [selectedCustomer, setSelectedCustomer] = useState(() => {
      if (!segment?.customers) return [];

      return segment.customers.map(customer => {
          // Find full details from the customers list
          const fullDetails = customers.find(c => c.customerId === customer.customerId);
          console.log(fullDetails)
          return fullDetails || customer; // Use full details if found, otherwise fallback to existing data
      });
  });

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

    const handleSave = async () => {
      let customerIds = [];
      let segmentCondition = "";
  
      if (segmentData.segmentType.toUpperCase() === "LABEL") {
          // Directly store selected customers
          customerIds = selectedCustomer.map(item => item.customerId);
          segmentCondition = "Selected Customers"; // Default condition for labels
      } else {
          // Filter customers based on conditions (City, State)
          const matchingCustomers = filterCustomersByConditions(customers, segmentData.conditions);
          customerIds = matchingCustomers.map(customer => customer.customerId);
          segmentCondition = JSON.stringify(segmentData.conditions); // Store actual conditions
      }
  
      const newSegment = {
          segmentTitle: segmentData.title,
          segmentType: segmentData.segmentType.toUpperCase(),
          segmentCondition, // Use the updated segmentCondition
          status: segmentData.status,
          customerIds: customerIds,
      };
  
      try {
          if (state?.index !== undefined) {
              await updateSegment(segment.id, newSegment);
          } else {
              await addSegment(newSegment);
          }
          navigate('/segments');
      } catch (error) {
          console.error("Error saving segment:", error);
      }
  };
  
  
    //   const handleSave = async () => {
    //     const newSegment = {
    //         segmentTitle: segmentData.title,
    //         segmentType: segmentData.segmentType.toUpperCase(),
    //         segmentCondition: JSON.stringify(segmentData.conditions), 
    //         segmentStatus: segmentData.status,
    //         customerIds: selectedCustomer.map(item => item.customerId),
    //     };
    
    //     try {
    //         if (state?.index !== undefined) {
        
    //             await updateSegment(segment.id, newSegment);
    //         } else {
        
    //             await addSegment(newSegment);
    //         }
    
    //         navigate('/segments');
    //     } catch (error) {
    //         console.error("Error saving segment:", error);
    //     }
    // };
    
    
      const handleStatusChange = (status) => {
        setSegmentData((prevData) => ({
          ...prevData,      
          status: status     
        }));
       

      };
      
     

  return (
    <div className='add-segments-page'>
        <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
        <span onClick={() => navigate("/segments")}>
          <IoArrowBackOutline size={25} />
        </span>
        <h5>New Segments</h5>
      </div>

        <div className='main d-flex gap-3'>
            <div className='left'>
                    <div className='title-sec bg-white p-3 d-flex flex-column rounded'>
                        <label>Title</label>
                        <input type="text" value={segmentData.title} onChange={handleTitleChange} />
                    </div>

                    <div className='seg-type p-3 bg-white mt-2 rounded'>
                        <h5>Segment type</h5>
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
                            <p className='ms-4 mt-2 text-body-tertiary'>
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
                                />
                                <label htmlFor='Automated' className='fw-medium'>Conditional</label>
                            </div>
                            <p className='ms-4 mt-2 text-body-tertiary'>
                                Existing and future customers that match the condition you set will automatically be added to this segment
                            </p>
                        </div>

                    </div>


                <ModalCustomerList
                    show={showModalCustomer}
                    handleClose={() => setShowModalCustomer(false)}
                    // products={products}
                    // addToCart={addToCart}
                    customers = {customers}
                    onCustomerAdd={handleCustomerAdd}
                   
                ></ModalCustomerList>


                {segmentData.segmentType.toLowerCase() === "label" && (
                    <div className='bg-white p-3 mt-2 rounded'>
                    <h5>Applies to</h5>
                    <div className="d-flex gap-2 mb-3 mt-3">
                    <SearchBox></SearchBox>
                    <div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModalCustomer(true)}
                    >
                        Browse
                    </button>
                    </div>
                </div>


                <div className="customer-list-ctn"> 
                <ul>
                {selectedCustomer.map((item,index)=>(

                   
                        <li id={index} className="d-flex align-items-center justify-content-between mt-3">
                            <div className='d-flex gap-2 align-items-center'>
                            <h5 className='m-0'>{item.customerName}</h5>
                            <GoDotFill />
                             <p className='fw-normal m-0'>{item.email}</p>
                             </div>
                             <button className='border border-0 bg-white' onClick={()=>handleDeleteCustomer(index)}>
                            <RxCross2 />
                            </button> 
                        </li>
                   
                ))}
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

                    </div>
                    )}


                <div className="d-flex justify-content-between mt-3">
                <DeleteBtn></DeleteBtn>

                {state?.index === undefined &&(
                <SubmitBtn clickFunction={handleSave} text={"Add"}></SubmitBtn>
                )}

                {state?.index !== undefined &&(
                    <SubmitBtn clickFunction={handleSave} text={"Save"}></SubmitBtn>
                )}

          </div>

            </div>


            <div className='right'>
                <div className='bg-white p-2 rounded'>
                    <h5>Status</h5>
                    <StatusFilter status={segmentData.status} onStatusChange={handleStatusChange}></StatusFilter>
                </div>
            </div>


        </div>

    </div>
  )
}

export default AddSegmentsPage