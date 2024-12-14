import React,{useState} from 'react'
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

const AddSegmentsPage = () => {

    const navigate = useNavigate ()

    const { state } = useLocation();

    const { rows, setRows } = useSegments();

    const segment = state?.index !== undefined ? rows[state.index] : null;

    const [segmentData, setSegmentData] = useState({
        title: segment?.title || "", // Use optional chaining
        segmentType: segment?.type || "Label", // Use optional chaining
        conditions: segment?.conditions || [
          { field: '', operator: '', value: '', period: '', chips: [], searchResults: [] },
        ],
        status: segment?.status || "Active", // Use optional chaining
      });
    
    const [showModalCustomer, setShowModalCustomer] = useState(false);
    const [customer,setCustomer] = useState(segment?.customerList || [])

    const handleCustomerAdd = (list) =>{
        setCustomer(list)
        console.log(customer)
      }

      const handleDeleteCustomer = (index) =>{
        const updated = customer.filter((item,ix) => ix != index );
        setCustomer(updated)
      }
    

      const handleTitleChange = (e) => {
        setSegmentData((prev) => ({ ...prev, title: e.target.value }));
      };
    
      // Handle segment type change
      const handleSegmentTypeChange = (e) => {
        setSegmentData((prev) => ({ ...prev, segmentType: e.target.id }));
      };

      const handleAppliesToChange = (value) => {
        setSegmentData((prev) => ({ ...prev, appliesTo: value }));
      };
    
      // Handle conditions from FilterConditions
      const handleConditionsChange = (newConditions) => {
        setSegmentData((prev) => ({ ...prev, conditions: newConditions }));
      };
    
      // Save the data (e.g., send to API or add to table)
      const handleSave = () => {
        const newSegment = {
          title: segmentData.title,
          type: segmentData.segmentType,
          customers: customer.length, // Number of customers
          conditions: [...segmentData.conditions], // Save conditions in their original format
          status: segmentData.status,
          customerList: [...customer], // Save the customer list
        };
      
        if (state?.index !== undefined) {
          // Editing an existing segment
          setRows((prevRows) =>
            prevRows.map((row, index) =>
              index === state.index ? newSegment : row
            )
          );
          console.log("Segment Updated:", newSegment);
        } else {
          // Adding a new segment
          setRows((prevRows) => [newSegment, ...prevRows]);
          console.log("New Segment Added:", newSegment);
        }

        navigate('/segments');
      
        // Optionally reset the form or navigate to another page
      };
      


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
                                checked={segmentData.segmentType === "Label"}
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
                                    id="Conditional"
                                    checked={segmentData.segmentType === "Conditional"}
                                    onChange={handleSegmentTypeChange}
                                />
                                <label htmlFor='conditional' className='fw-medium'>Conditional</label>
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
                    onCustomerAdd={handleCustomerAdd}
                ></ModalCustomerList>


                {segmentData.segmentType === "Label" && (
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
                {customer.map((item,index)=>(

                   
                        <li id={index} className="d-flex align-items-center justify-content-between mt-3">
                            <div className='d-flex gap-2 align-items-center'>
                            <h5 className='m-0'>{item.name}</h5>
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
                    
                    {segmentData.segmentType === "Conditional" && (
                    <div className='bg-white p-3 mt-2 rounded'>
                        <h5>Conditions</h5>

                        <FilterConditions 
                          onConditionsChange={handleConditionsChange}
                          condition = {segment?.conditions}
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