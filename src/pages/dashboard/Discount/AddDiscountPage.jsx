import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate ,useLocation} from "react-router-dom";
import StatusFilter from "../../../components/Filter/DayFilter/StatusFilter/StatusFilter";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import "./AddDiscountPage.css";
import { Dropdown } from "react-bootstrap";
import SearchBox from "../../../components/SearchBox/SearchBox";
import AddBtn from "../../../components/Buttons/Add/AddBtn";
import DeleteBtn from "../../../components/Buttons/Delete/DeleteBtn";
import ModalOrder from "../../../components/Modal/ModalOrder";
import ModalCustomerList from "../../../components/Modal/ModalCustomerList";
import { RxCross2 } from "react-icons/rx";
import { useDiscounts } from "../../../components/Context/DiscountContext";


const AddDiscountPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { addDiscount , discountData } = useDiscounts();

  const discount = state?.index !== undefined ? discountData[state.index] : null;

  const [formData, setFormData] = useState({
    used: discount?.used || 0,
    discountCode: discount?.discountCode || "",   
    discountType: discount?.type || "Percentage", // Default selected type
    discountValue: discount?.discountValue || "",
    appliesTo: discount?.appliesTo || [], // Products or categories applied to
    minPurchaseRequirement: discount?.minPurchaseRequirement || {
      type: "No", // No, min-purchase, min-quantity
      value: ""
    },
    customerEligibility: discount?.customerEligibility || {
      type: "All", // All, specific-segment, specific-customer
      customers: []
    },
    maxUsage: discount?.maxUsage || {
      limitTotal: false,
      limitPerCustomer: false
    },
    activeDates: discount?.activeDates || {
      startDate: "",
      startTime: "",
      hasEndDate: false,
      endDate: "",
      endTime: ""
    },
    status: discount?.status || "Active" // Default status
  });

  

  const [selectedMethod, setSelectedMethod] = useState(discount?.selectedMethod || "Code");

  const [productSelect, setProductSelect] = useState(discount?.productSelect || []);

  const [customer,setCustomer] = useState(discount?.customer || [])

  const handleReceiveOrder = (order) => {
    setProductSelect(order);
    console.log(productSelect)
  };

  const handleCustomerAdd = (list) =>{
    setCustomer(list)
    console.log(customer)
  }


  const handleDeleteOrder = (index) => {
    const updatedProductSelect = productSelect.filter((product, ix) => ix !== index);
    setProductSelect(updatedProductSelect); // Update the state with the new array
  };

  const handleDeleteCustomer = (index) =>{
    const updated = customer.filter((item,ix) => ix != index );
    setCustomer(updated)
  }
  

  const products = [
    {
      id: 1,
      name: "Cotton Yarn",
      size: ["2/60", "2/74", "2/80", "2/92"],
      colors: [
        "#FF5733",
        "#33FFCE",
        "#850713",
        "#3967FF",
        "#00A65E",
        "#000080",
        "#030303",
        "#FF33A6",
        "#334CFF",
      ],
      stock: {
        "2/60": 30,
        "2/74": 60,
        "2/80": 90,
        "2/92": 20,
      },
    },
    {
      id: 2,
      name: "Silk",
      size: ["2/60", "2/74", "2/80", "2/92"],
      colors: [
        "#FF5733",
        "#33FFCE",
        "#850713",
        "#3967FF",
        "#00A65E",
        "#000080",
        "#030303",
        "#FF33A6",
        "#334CFF",
      ],
      stock: {
        "2/60": 30,
        "2/74": 60,
        "2/80": 90,
        "2/92": 20,
      },
    },
  ];

  const handleToggleChange = (event, newMethod) => {
    if (newMethod !== null) {
      setSelectedMethod(newMethod);
    }
  };

  const [selectedType, setSelectedType] = useState("Percentage"); // Default status selection

  const handleSelect = (status) => {
    setSelectedType(status);
  };

  const [showModalOrder, setShowModalOrder] = useState(false);
  const [showModalCustomer, setShowModalCustomer] = useState(false);

  const [selectedOption, setSelectedOption] = useState(discount?.selectedOption || "");
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState(discount?.selectedOptionCustomer || "");

  // Handler for setting the selected option
  const handleSelection = (option) => {
    // Toggle the selected option on/off
    setSelectedOption((prev) => (prev === option ? "" : option));
  };

  const handleSelectionCustomer = (option) => {
    // Toggle the selected option on/off
    setSelectedOptionCustomer((prev) => (prev === option ? "" : option));
  };


  const handleToggle = (event, value) => {
    setFormData((prev) => ({ ...prev, method: value }));
  };
  

  const handleDiscountCodeChange = (e) => {
    setFormData((prev) => ({ ...prev, discountCode: e.target.value }));
  };

  const handleDiscountTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, discountType: type }));
  };
  
  const handleDiscountValueChange = (e) => {
    setFormData((prev) => ({ ...prev, discountValue: e.target.value }));
  };
  const handleAppliesTo = (products) => {
    setFormData((prev) => ({ ...prev, appliesTo: products }));
  };
 
  const handleMinPurchaseChange = (key, e) => {
    setFormData((prev) => ({
      ...prev,
      minPurchaseRequirement: {
        [key]: e.target.value, // Dynamically update either "type" or "value"
      },
    }));
  };
  
      
  const handleCustomerEligibilityChange = (type, customers = []) => {
  setFormData((prev) => ({
    ...prev,
    customerEligibility: { type, customers }
  }));
};

const handleMaxUsageChange = (field1,field2) => {
    setFormData((prev) => ({
      ...prev,
      maxUsage:{
        [field1]: !prev.maxUsage[field1], // Toggle the selected field
        [field2]: false, // Ensure the other field is false
      },
    }));
  };

  const handleActiveDatesChange = (field, e) => {

    if(field==='hasEndDate'){
        setFormData((prev) => ({
            ...prev,
            activeDates: { ...prev.activeDates, [field]: !prev.activeDates[field] }
          }));
    }
    else{
    setFormData((prev) => ({
      ...prev,
      activeDates: { ...prev.activeDates, [field]: e.target.value }
    }));
    }
  };

  const handleSubmit = () => {

    setFormData((prev) => ({
        ...prev,
        selectedOptionCustomer,
        selectedOption,
        method:selectedMethod,
        productSelect,
        customer
      }));

      const newDiscountData = {
        ...formData,
        selectedOptionCustomer,
        selectedOption,
        method: selectedMethod,
        productSelect,
        customer,
      };
    
      if (state?.index !== undefined) {
        // Pass the index for updating the specific discount
        addDiscount({ ...newDiscountData, index: state.index });
      } else {
        // Add as a new discount
        addDiscount(newDiscountData);
      }
    
    console.log(formData);
    navigate('/discounts');
    // Send `formData` to the parent component or API
  };
  

  const handleStatusChange = (status) =>{
    setFormData((prev) => ({
        ...prev,
        status: status
    }));
  
    }
  

  return (
    <div className="add-discount">
      <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
        <span onClick={() => navigate("/discounts")}>
          <IoArrowBackOutline size={25} />
        </span>
        <h5>Add discount</h5>
      </div>

      <div className="main d-flex gap-2 mt-2">
        <div className="left">
          <div className="method-sec">
            <h5>Method</h5>
            <ToggleButtonGroup
              className="toggle-btn"
              value={selectedMethod}
              exclusive
              onChange={handleToggleChange}
              aria-label="discount method"
              style={{ marginBottom: "16px" }}
            >
              <ToggleButton
                value="Code"
                aria-label="discount code"
                sx={{ textTransform: "none" }}
              >
                Discount Code
              </ToggleButton>
              <ToggleButton
                value="Automatic"
                aria-label="automatic discount"
                sx={{ textTransform: "none" }}
              >
                Automatic Discount
              </ToggleButton>
            </ToggleButtonGroup>
            <div className="d-flex flex-column">
              <label>Discount code</label>
              <input 
              type="text"   
              value={formData.discountCode}
              onChange={handleDiscountCodeChange}>
                
              </input>
            </div>
          </div>

          <div className="discount-value mt-2 p-3 bg-white rounded">
            <h5>Discount Value</h5>
            <div className="d-flex gap-2">
              <Dropdown onSelect={handleDiscountTypeChange} size="sm" className="w-50 ">
                <Dropdown.Toggle
                
                  variant="light"
                  id="dropdown-basic"
                  className="d-flex border border-secondary-subtle align-items-center justify-content-between gap-2 w-100 mt-1"
                >
                    {formData.discountType}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  <Dropdown.Item eventKey="Percentage">
                    Percentage
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Fixed Amount">
                    Fixed Amount
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
                
              <input value={formData.discountValue} onChange={(e)=>handleDiscountValueChange(e)} className="w-50 mt-1" type="number"></input>
            </div>

            <ModalOrder
              show={showModalOrder}
              handleClose={() => setShowModalOrder(false)}
              products={products}
              // addToCart={addToCart}
              onOrderCreate={handleReceiveOrder}
            ></ModalOrder>

            <div className="mt-2">
              <label>Applies to</label>
              <div className="d-flex gap-2 mb-3 mt-3">
                <SearchBox></SearchBox>
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModalOrder(true)}
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>

            <div className="product-select">
            {productSelect.map((product,ix) => (
                <ul key={product.name}> {/* Use a unique key */}
                {product.color.map((color, index) => (
                    <li key={index} className="d-flex align-items-center justify-content-between">

                        <div className="d-flex align-items-center justify-content-between  w-50">
                        {product.productName} 
                        <div>
                        <div style={{padding:'0.3rem 0.8rem',backgroundColor:'#EFEFEF',border:'1px solid #B9C0CD' ,borderRadius:'0.9rem',textAlign:'center'}}>
                        {product.size} 
                        </div>
                        </div>
                        

                            <div
                                    key={index}
                                    style={{
                                    backgroundColor: color,
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    border: "2px solid #ccc",
                                
                                    padding:"0"
                                    }}
                                ></div>
                        </div>

                        <button onClick={()=>handleDeleteOrder(ix)}>
                        <RxCross2 />
                        </button>
                    


                        
                    </li>
                ))}
                </ul>
            ))}
            </div>
          </div>

          <div className="min-purchase mt-2">
            <h5>Minimum purchase requirements</h5>
            <ul>
              <li>
                <input
                  type="checkbox"
                  checked={selectedOption === "No"}
                  onChange={() => handleSelection("No")}
                />
                <label>No minimum requirement</label>
              </li>
              <li className="d-flex flex-column align-items-start">
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedOption === "minPurchase"}
                    onChange={() => handleSelection("minPurchase")}
                  />
                  <label>Minimum purchase amount (₹)</label>
                </div>
                {/* Render input field if 'min-purchase' is selected */}
                {selectedOption === "minPurchase" && (
                  <div className="d-flex align-items-center gap-2 ps-4">
                    <input type="number" placeholder="₹" value={formData.minPurchaseRequirement.minPurchase}  onChange={(e)=>handleMinPurchaseChange('minPurchase',e)}/>
                  </div>
                )}
              </li>
              <li className="d-flex flex-column align-items-start">
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedOption === "minQuantity"}
                    onChange={() => handleSelection("minQuantity")}
                  />
                  <label>Minimum Quantity of items</label>
                </div>
                {/* Render input field if 'min-quantity' is selected */}
                {selectedOption === "minQuantity" && (
                  <div className="d-flex align-items-center gap-2 ps-4">
                    <input type="number" placeholder="Items" value={formData.minPurchaseRequirement.minQuantity} onChange={(e)=>handleMinPurchaseChange('minQuantity',e)}/>
                  </div>
                )}
              </li>
            </ul>
          </div>

          <div className="min-purchase mt-2">
            <h5>Customer eleigibility</h5>

            <ul>
              <li>
                <input 
                 type="checkbox"
                 checked={selectedOptionCustomer === "All"}
                 onChange={() => handleSelectionCustomer("All")}
                ></input>
                <label>All customers</label>
              </li>
              <li className="d-flex flex-column align-items-start">
                <div className="d-flex align-items-center gap-2">
                <input type="checkbox"
                 checked={selectedOptionCustomer === "specific-segment"}
                 onChange={() => handleSelectionCustomer("specific-segment")}
                ></input>
                <label>Specific customer sagements</label>
                </div>

                <ModalCustomerList
                show={showModalCustomer}
                handleClose={() => setShowModalCustomer(false)}
                // products={products}
                // addToCart={addToCart}
                onCustomerAdd={handleCustomerAdd}
                ></ModalCustomerList>

                {selectedOptionCustomer === "specific-segment" && (
                  <div className="d-flex align-items-center gap-2 ps-4">
                             
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
                  
                  </div>
                )}
              </li>
              <li className="d-flex flex-column align-items-start">
                <div className="d-flex align-items-center gap-2">
                <input type="checkbox"
                 checked={selectedOptionCustomer === "specific-customer"}
                 onChange={() => handleSelectionCustomer("specific-customer")}
                ></input>
                <label>Specific customers</label>
                </div>
                {selectedOptionCustomer === "specific-customer" && (
                    <div className="w-100 pe-3">

                  <div className="d-flex align-items-center gap-2 ps-4 ">
                             
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
                     
                  </div>

                  <div className="customer-list-ctn"> 
                    <ul>
                    {customer.map((item,index)=>(

                       
                            <li id={index} className="d-flex align-items-center justify-content-between">
                                <h5>{item.name}</h5>
                                 <h5>{item.email}</h5>
                                 <button onClick={()=>handleDeleteCustomer(index)}>
                                <RxCross2 />
                                </button> 
                            </li>
                       
                    ))}
                     </ul>
                  </div>

                  </div>
                )}
              </li>
            </ul>
          </div>

          <div className="min-purchase mt-2">
            <h5>Maximum discount usage</h5>
            <ul>
              <li>
                <input type="checkbox" checked={formData.maxUsage.limitTotal===true} onChange={()=>handleMaxUsageChange('limitTotal','limitPerCustomer')}></input>
                <label>
                  Limit number of times this discount can be used in total
                </label>
              </li>
              <li>
                <input type="checkbox" checked={formData.maxUsage.limitPerCustomer===true}  onChange={()=>handleMaxUsageChange('limitPerCustomer','limitTotal')}></input>
                <label>Limit to one user per customer</label>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded p-3 mt-2">
            <h5>Active dates</h5>

            <div className="d-flex gap-2">
              <div className="d-flex gap-2 flex-column flex-grow-1">
                <label>Start date</label>
                <input type="date" value={formData.activeDates.startDate} onChange={(e)=>handleActiveDatesChange('startDate',e)}></input>
              </div>
              <div className="d-flex gap-2 flex-column flex-grow-1">
                <label>Start time (IST)</label>
                <input type="time" value={formData.activeDates.startTime}  onChange={(e)=>handleActiveDatesChange('startTime',e)}></input>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mt-2">
              <input type="checkbox" checked={formData.activeDates.hasEndDate===true} onChange={(e)=>handleActiveDatesChange('hasEndDate',e)}></input>
              <label>Set end date</label>
            </div>

            {formData.activeDates.hasEndDate===true && (
                 <div className="d-flex gap-2 mt-2">
                 <div className="d-flex gap-2 flex-column flex-grow-1">
                   <label>Start date</label>
                   <input type="date" value={formData.activeDates.endDate} onChange={(e)=>handleActiveDatesChange('endDate',e)}></input>
                 </div>
                 <div className="d-flex gap-2 flex-column flex-grow-1">
                   <label>Start time (IST)</label>
                   <input type="time" value={formData.activeDates.endTime}  onChange={(e)=>handleActiveDatesChange('endTime',e)}></input>
                 </div>
               </div>
            )}
           


          </div>

          <div className="d-flex justify-content-between mt-3">
            <DeleteBtn></DeleteBtn>

            {state?.index === undefined &&(
            <AddBtn clickFunction={handleSubmit} text={"Add"}></AddBtn>
            )}

            {state?.index !== undefined &&(
                <AddBtn clickFunction={handleSubmit} text={"Save"}></AddBtn>
            )}

          </div>
        </div>

        {/* <ModalOrder
                    show={showModalOrder}
                    handleClose={() => setShowModalOrder(false)}
                    products={products}
                    addToCart={addToCart}
                    onOrderCreate={handleReceiveOrder}
                >

                </ModalOrder> */}

        <div className="right">
          <div>
            <h5>Status</h5>
            <StatusFilter status={formData.status} onStatusChange={handleStatusChange}></StatusFilter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDiscountPage;
