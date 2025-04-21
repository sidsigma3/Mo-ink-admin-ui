import React, { useState ,useEffect} from "react";
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
import SubmitBtn from "../../../components/Buttons/Submit/SubmitBtn";
import { getAllProduct } from "../../../services/ProductService";
import { getAllSegment } from "../../../services/SegmentService";
import ModalSegmentList from "../../../components/Modal/ModalSegmentList";
import { getAllCustomer } from "../../../services/CustomerService";
import { addDiscount , deleteDiscount, updateDiscount } from "../../../services/DiscountService";
import ModalProdcutSelect from "../../../components/Modal/ModalProdcutSelect";
import StatusInput from "../../../components/StatusInput/StatusInput";

const AddDiscountPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errors, setErrors] = useState({});

  const {index , discountData} = state || {}

  // const { addDiscount , discountData } = useDiscounts();

  const discount = state?.index !== undefined ? discountData[index] : null;

  const isViewMode = !!state

  const parseMinPurchaseRequirement = (requirementString) => {
    if (!requirementString || requirementString === "No minimum purchase requirement") {
        return { "No": "" };
    }

    const minPurchaseMatch = requirementString.match(/Minimum purchase amount \(₹\) : (\d+)/);
   
    if (minPurchaseMatch) {
        return {"minPurchase" : minPurchaseMatch[1] };
    }

    const minQuantityMatch = requirementString.match(/Minimum quantity required: (\d+)/);
    if (minQuantityMatch) {
        return { "minQuantity": minQuantityMatch[1] };
    }

    return { type: "No", value: "" };
};

const parseMinPurchaseRequirementType = (requirementString) => {
  if (!requirementString || requirementString === "No minimum purchase requirement") {
      return  "No"
  }

  const minPurchaseMatch = requirementString.match(/Minimum purchase amount \(₹\) : (\d+)/);
  if (minPurchaseMatch) {
      return  "minPurchase"
  }

  const minQuantityMatch = requirementString.match(/Minimum quantity required: (\d+)/);
  if (minQuantityMatch) {
      return  "minQuantity"
  }

  return { type: "No", value: "" };
};


const parseMaxPurchaseRequirement = (requirementString) => {
  if (!requirementString || requirementString === "No limit") {
    return { maxUsage: { limitTotal: false, limitPerCustomer: false }, usageLimit: "" };
  }

  const limitTotalMatch = requirementString.match(/Limit number of times.*: (\d+)/);
  if (limitTotalMatch) {
    return { maxUsage: { limitTotal: true, limitPerCustomer: false }, usageLimit: limitTotalMatch[1] };
  }

  if (requirementString.includes("Limit to one use per customer")) {
    return { maxUsage: { limitTotal: false, limitPerCustomer: true }, usageLimit: "" };
  }

  return { maxUsage: { limitTotal: false, limitPerCustomer: false }, usageLimit: "" };
};

const [formData, setFormData] = useState(() => {
  const parsedActiveDates = discount?.activeDates || {
    startDate: "",
    startTime: "",
    hasEndDate: false,
    endDate: "",
    endTime: ""
  };

  if (discount?.startDateTime) {
    const startDateObj = new Date(discount.startDateTime);
    parsedActiveDates.startDate = startDateObj.toISOString().split("T")[0];
  
    // Extract only HH:MM format for time
    parsedActiveDates.startTime = startDateObj.toTimeString().slice(0, 5);
  }
  
  if (discount?.endDateTime) {
    const endDateObj = new Date(discount.endDateTime);
    parsedActiveDates.endDate = endDateObj.toISOString().split("T")[0];
  
    // Extract only HH:MM format for time
    parsedActiveDates.endTime = endDateObj.toTimeString().slice(0, 5);
    parsedActiveDates.hasEndDate = true;
  }

  const parsedMax = parseMaxPurchaseRequirement(discount?.maxPurchaseRequirements);

  return {
    used: discount?.used || 0,
    discountCode: discount?.discountCode || "",   
    discountType: discount?.discountType || "Percentage", // Default selected type
    discountValue: discount?.discountValue || "",
    appliesTo: discount?.applicableProducts || [], // Products or categories applied to
    minPurchaseRequirement: parseMinPurchaseRequirement(discount?.minPurchaseRequirement) || {
      type: "No", 
      value: ""
    },
    customerEligibility: discount?.customerEligibilityType
      ? { type: discount.customerEligibilityType, customers: [] }
      : { type: "All", customers: [] },

    maxUsage: parsedMax.maxUsage,
    usageLimit: parsedMax.usageLimit,
    
    activeDates: parsedActiveDates ,
    status: discount?.discountStatus || "Active" 
  }});

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


      const [productData,setProductData] = useState([])

      useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllProduct();
            setProductData(data.data)
          
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
      
        fetchData(); 
      }, []);


   

      const aggregateProductData = (productData) => {
        return productData.map((product) => {
          const groupedVariants = product.variants.reduce((acc, variant) => {
            const { size, color, availableWeight ,id } = variant;
      
            if (!acc[size]) {
              acc[size] = {
                id,
                size,
                variants: [],
                totalWeight: 0,
              };
            }
    
            
      
            // Add unique colors for this size
            if (!acc[size].variants.some((v) => v.colorName === color.colorName)) {
              acc[size].variants.push({
                colorName: color.colorName,
                hexCode: color.hexCode || "#ccc",
                available:variant.availableWeight,
                price:variant.pricePerKg,
                id:variant.id,
              });
            }
            
            // Accumulate availableWeight for this size
            acc[size].totalWeight += Number(availableWeight);
      
            return acc;
          }, {});
      
          // Return the aggregated product with grouped variants
          return {
            productId: product.id,
            productName: product.productName,
            productDescription: product.productDescription,
            productImage: product.productImage,
            compareAtPrice:product.productPrice?.compareAtPrice,
            costPerItemPerKg:product.productPrice?.costPerItemPerKg,
            gstOnProduct:product.productPrice?.gstOnProduct,
            pricePerKg:product.productPrice?.pricePerKg,
            availableStatus:product.availableStatus,
            groupedVariants: Object.values(groupedVariants),
          };
        });
      };
    
     
  const finalData = aggregateProductData(productData)

  const [selectedMethod, setSelectedMethod] = useState(discount?.discountMethod || "Code");

  const [productSelect, setProductSelect] = useState(discount?.applicableProducts || []);
 
  const [customers,setCustomers] = useState([])
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCustomer();
        setCustomers(data.data)
        
      } catch (error) {
        console.error('Error fetching Customers:', error);
      }
    };
  
      fetchData(); 
    }, []); 

    

  const [selectedSegment,setSelectedSegment] = useState(discount?.applicableSegments || [])
 
  const [customer, setCustomer] = useState([]);
  useEffect(() => {
   
    if (discount && discount.eligibleCustomers && Array.isArray(discount.eligibleCustomers)) {
      const matchedCustomers = discount.eligibleCustomers.map((item) => {
        const customerId = Number(item.customerId); 
  
        const foundCustomer = customers.find(val => Number(val.customerId) === customerId);
  
        return foundCustomer
          ? {
              customerName: foundCustomer.customerName,
              email: foundCustomer.email,
              customerId: foundCustomer.customerId
            }
          : null;
      }).filter(Boolean); 
  
      setCustomer(matchedCustomers);
    } else {
   
      setCustomer([]);
    }
  }, [customers, discount]); 


  const handleReceiveOrder = (order) => {
    console.log(order)
    setProductSelect(order);
    
  };

  const handleCustomerAdd = (list) =>{
    setCustomer(list)
  }

  const handleSegmentAdd = (list) =>{
    setSelectedSegment(list)
  }


  const handleDeleteOrder = (index) => {
    const updatedProductSelect = productSelect.filter((product, ix) => ix !== index);
    setProductSelect(updatedProductSelect); 
  };

  const handleDeleteCustomer = (index) =>{
    const updated = customer.filter((item,ix) => ix != index );
    setCustomer(updated)
  }

  const handleDeleteSegment = (index) =>{
    const updated = selectedSegment.filter((item,ix) => ix != index );
    setSelectedSegment(updated)
  }
  

  
  const handleToggleChange = (event, newMethod) => {
    if (newMethod !== null) {
      setSelectedMethod(newMethod);
    }
  };

  const [selectedType, setSelectedType] = useState("Percentage"); 

  const handleSelect = (status) => {
    setSelectedType(status);
  };

  const [showModalOrder, setShowModalOrder] = useState(false);
  const [showModalCustomer, setShowModalCustomer] = useState(false);
  const [showModalSegment, setShowModalSegment] = useState(false);

  const [selectedOption, setSelectedOption] = useState(parseMinPurchaseRequirementType(discount?.minPurchaseRequirement) || "");
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState(discount?.customerEligibilityType || "All");

 
  const handleSelection = (option) => {
   
    setSelectedOption((prev) => (prev === option ? "" : option));
  };

  const handleSelectionCustomer = (option) => {
 
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

  const handleSubmit = async() => {
    setErrors({}); // Reset errors before validation

    let validationErrors = {};

   
    // if (!formData.discountTitle?.trim()) validationErrors.discountTitle = "Discount title is required.";
    if (!formData.discountCode?.trim()) validationErrors.discountCode = "Discount code is required.";
    if (!formData.discountType) validationErrors.discountType = "Please select a discount type.";
    if (!formData.discountValue || formData.discountValue <= 0) validationErrors.discountValue = "Valid discount value is required.";
    if (!selectedOptionCustomer) validationErrors.customerEligibilityType = "Please select customer eligibility.";
    if (selectedOptionCustomer === "specific-segment" && selectedSegment.length === 0)
        validationErrors.specificSegment = "Select at least one customer segment.";
    if (selectedOptionCustomer === "specific-customer" && customer.length === 0)
        validationErrors.specificCustomer = "Select at least one specific customer.";
    if (selectedOptionCustomer === "All" && customers.length === 0)
        validationErrors.allCustomers = "No customers available.";
    if (productSelect.length === 0) validationErrors.products = "Select at least one product.";
    if (!formData.activeDates.startDate) validationErrors.startDate = "Start date is required.";
    if (!formData.activeDates.startTime) validationErrors.startTime = "Start time is required.";
    // if (formData.activeDates.hasEndDate && !formData.activeDates.endDate)
    //     validationErrors.endDate = "End date is required when 'Has End Date' is selected.";

    // Stop submission if errors exist
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }
   
    let eligibleCustomerIds = [];
  
    if (selectedOptionCustomer === "specific-segment") {
      
      const segmentCustomerIds = selectedSegment.flatMap(segment => segment.customers.map(c => Number(c.customerId)));
      eligibleCustomerIds = [...new Set(segmentCustomerIds)]; // Remove duplicates
    } else if (selectedOptionCustomer === "specific-customer") {
      
        eligibleCustomerIds = customer.map(c => Number(c.customerId));
    } else if (selectedOptionCustomer === "All") {
      
        eligibleCustomerIds = customers.map(c => Number(c.customerId));
    }
  
    
    let minPurchaseRequirementString = "No minimum purchase requirement";
    if (selectedOption === "minPurchase") {
      minPurchaseRequirementString = `Minimum purchase amount (₹) : ${formData.minPurchaseRequirement[selectedOption]}`;
    } else if (selectedOption === "minQuantity") {
      minPurchaseRequirementString = `Minimum quantity required: ${formData.minPurchaseRequirement[selectedOption]}`;
    }

    let maxPurchaseRequirementString = "No usage limit";

    if (formData.maxUsage.limitTotal) {
      maxPurchaseRequirementString = `Limit number of times this discount can be used in total: ${formData.usageLimit}`;
    } else if (formData.maxUsage.limitPerCustomer) {
      maxPurchaseRequirementString = "Limit to one use per customer";
    }
   

    const formatDateTime = (date, time) => {
      return date ? `${date}T${time || "00:00:00"}` : null;
    };
  
    const newDiscountData = {
      discountTitle: formData.discountCode,
      discountCode: formData.discountCode,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      appliesToAllCustomers: selectedOptionCustomer === "All",
      appliesToAllProducts: productSelect.length === finalData.length,
      productEligibilityType: productSelect.length === finalData.length ? "All" : "Specific Product",
      customerEligibilityType: selectedOptionCustomer,
      discountStatus: formData.status,
      minPurchaseRequirement: minPurchaseRequirementString,
      maxPurchaseRequirements: maxPurchaseRequirementString,
      discountMethod: selectedMethod,
      applicableProductIds: productSelect.map(p => p.productId ? Number(p.productId) : Number(p.id)), 
      applicableSegmentIds:selectedSegment.map(s =>Number(s.segmentId)),
      eligibleCustomerIds,
      startDateTime: formatDateTime(formData.activeDates.startDate, formData.activeDates.startTime),
      endDateTime: formData.activeDates.hasEndDate
        ? formatDateTime(formData.activeDates.endDate, formData.activeDates.endTime)
        : null
      
    };

  
    if (state?.index !== undefined) {
      // Update existing discount
          await updateDiscount(discount?.discountId, newDiscountData);
    } else {
          await addDiscount(newDiscountData)
          console.log(newDiscountData)
    }
  
    navigate('/discounts');
  };
  

  const handleStatusChange = (status) =>{
    setFormData((prev) => ({
        ...prev,
        status: status
    }));
  
    }
  
    const handleDelete = async () => {
      const confirmed = window.confirm("Are you sure you want to delete this discount?");
      if (!confirmed) return;
  
      try {
          const id = discount.discountId;
          await deleteDiscount(id);
          navigate('/discounts');
      } catch (error) {
          console.error('Error Deleting Discount:', error);
      }
  };
  

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
            
            {/* <h5>Method</h5> */}
            {/* <ToggleButtonGroup
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
            </ToggleButtonGroup> */}


            <div className="d-flex flex-column">
              <h5>Discount code</h5>

              {isViewMode === true ? (
                  <h4 style={{fontSize:'1.1rem'}}>{formData.discountCode}</h4>
              ):(
                <input 
                type="text"   
                value={formData.discountCode}
                onChange={handleDiscountCodeChange}
                readOnly={isViewMode}
                > 
                </input>
              )}
              {errors.discountCode && <p className="text-danger">{errors.discountCode}</p>}
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
                  <Dropdown.Item eventKey="FixedAmount">
                    Fixed Amount
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
                
              <input value={formData.discountValue} onChange={(e)=>handleDiscountValueChange(e)} className="w-50 mt-1" type="number"></input>
              {errors.discountValue && <p className="text-danger">{errors.discountValue}</p>}
            </div>

            {/* <ModalOrder
              show={showModalOrder}
              handleClose={() => setShowModalOrder(false)}
              products={finalData}
              // addToCart={addToCart}
              onOrderCreate={handleReceiveOrder}
            ></ModalOrder> */}


            <ModalProdcutSelect
              show={showModalOrder}
              handleClose={() => setShowModalOrder(false)}
              products={finalData}
              onOrderCreate={handleReceiveOrder}
            ></ModalProdcutSelect>

            <div className="mt-2">
              <label>Applies to</label>
              <div className="d-flex gap-2 mb-3 mt-3 align-items-center">
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
                <ul> 
                  <li key={ix}>
                      {product.productName}
                  </li>

                </ul>
            ))}
            {errors.products && <p className="text-danger">{errors.products}</p>}
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
                  <label>Minimum Quantity of items (kg)</label>
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
                customers = {customers}
                onCustomerAdd={handleCustomerAdd}
                preSelectedCustomers={customer}
                ></ModalCustomerList>


                <ModalSegmentList
                show={showModalSegment}
                handleClose={()=>setShowModalSegment(false)}
                onSegmentAdd= {handleSegmentAdd}
                segments = {segments}
                ></ModalSegmentList>

                {selectedOptionCustomer === "specific-segment" && (
                  <div className="ps-4 w-100">
                             
                    <div className="d-flex gap-2 mb-3 mt-3 w-50">
                        <SearchBox></SearchBox>
                        <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowModalSegment(true)}
                        >
                            Browse
                        </button>
                        </div>
                    </div>

                    <div className="customer-list-ctn"> 
                    <ul>
                    {selectedSegment.map((item,index)=>(
                            <li id={index} className="d-flex align-items-center justify-content-between">
                                <h5>{item.segmentTitle}</h5>
                                 <h5>{item.customerCount} Customers</h5>
                                 <button onClick={()=>handleDeleteSegment(index)}>
                                <RxCross2 />
                                </button> 
                            </li>
                       
                    ))}
                     </ul>
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
                                <h5>{item.customerName}</h5>
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
              <li className="d-flex flex-column align-items-start">
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.maxUsage.limitTotal === true}
                    onChange={() => handleMaxUsageChange("limitTotal", "limitPerCustomer")}
                  />
                  <label>Limit number of times this discount can be used in total</label>
                </div>

                {/* Show input only when limitTotal is selected */}
                {formData.maxUsage.limitTotal && (
                  <div className="ps-4">
                    <input
                      type="number"
                      placeholder="Enter usage limit"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        usageLimit: e.target.value
                      }))}
                    />
                  </div>
                )}
              </li>

              <li>
                <input
                  type="checkbox"
                  checked={formData.maxUsage.limitPerCustomer === true}
                  onChange={() => handleMaxUsageChange("limitPerCustomer", "limitTotal")}
                />
                <label>Limit to one use per customer</label>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded p-3 mt-2">
            <h5>Active dates</h5>

            <div className="d-flex gap-2">
              <div className="d-flex gap-2 flex-column flex-grow-1">
                <label>Start date</label>
                <input type="date" value={formData.activeDates.startDate} onChange={(e)=>handleActiveDatesChange('startDate',e)}></input>
                {errors.startDate && <p className="text-danger">{errors.startDate}</p>}
              </div>
              <div className="d-flex gap-2 flex-column flex-grow-1">
                <label>Start time (IST)</label>
                <input type="time" value={formData.activeDates.startTime}  onChange={(e)=>handleActiveDatesChange('startTime',e)}></input>
                {errors.startTime && <p className="text-danger">{errors.startTime}</p>}
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

          <div className="d-flex justify-content-between my-4">
            <DeleteBtn clickFunction={handleDelete}></DeleteBtn>

            {state?.index === undefined &&(
            <SubmitBtn clickFunction={handleSubmit} text={"Add"}></SubmitBtn>
            )}

            {state?.index !== undefined &&(
                <SubmitBtn clickFunction={handleSubmit} text={"Save"}></SubmitBtn>
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
            <StatusInput status={formData.status} onStatusChange={handleStatusChange}></StatusInput>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDiscountPage;
