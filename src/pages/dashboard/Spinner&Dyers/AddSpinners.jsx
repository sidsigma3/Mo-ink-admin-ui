import React ,{useState,useEffect} from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import {  useNavigate ,useLocation} from 'react-router-dom';
import { useCustomerContext } from '../../../components/Context/CustomerContext';
import AddBtn from '../../../components/Buttons/Add/AddBtn';
import DeleteBtn from '../../../components/Buttons/Delete/DeleteBtn';
import { Dropdown, Table } from 'react-bootstrap';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import "./AddSpinners.css"
import { useSpinnerDyers } from '../../../components/Context/SpinnersAndDyersContext';
import { RiFilePaper2Line } from "react-icons/ri";
import SubmitBtn from '../../../components/Buttons/Submit/SubmitBtn';
import { addVendor, deleteVendor, updateVendor } from '../../../services/VendorsService';
import StatusInput from '../../../components/StatusInput/StatusInput';

import DownloadRateChartTemplateButton from '../../../components/Buttons/RateChartButton/DownloadRateChartTemplateButton';
import { getAllProduct } from '../../../services/ProductService';
import * as XLSX from "xlsx";
import { createVendorRateChart ,getRateChart} from '../../../services/VendorsService';
import ImportBtn from "../../../components/Buttons/Import/ImportBtn";
import { PiExportBold } from "react-icons/pi";
import { CgImport } from "react-icons/cg";
import { getVendorOrdersByVendorId } from '../../../services/OrderService';
import SelectState from '../../../components/SelectState/SelectState';
import { IoIosArrowForward, IoIosArrowDown  } from "react-icons/io";


const AddSpinners = () => {
  
  const navigate = useNavigate ()
  const { state } = useLocation();

  const [expandedTypeIndex, setExpandedTypeIndex] = useState({});

  const [expandedProductIndex, setExpandedProductIndex] = useState(null);

  const [expandedVariantIndex, setExpandedVariantIndex] = useState({});

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [expandedProducts, setExpandedProducts] = useState({});
  const [expandedSizes, setExpandedSizes] = useState({});
  const [expandedVariants, setExpandedVariants] = useState({});

  const {index,data} = state || {}

  const customer = state?.index !== undefined ? data[index] : null;

  const [products,setProducts] = useState()

  const [manageWallet,setManageWallet] = useState(false)
  

  const [status,setStatus] = useState(customer?.status.toLowerCase() || 'Active')

  const [tag,setTag] = useState (customer?.vendorType.toLowerCase() || 'Spinner')  
                                                   
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    whatsapp: customer?.whatsappNumber || "",
    phone: customer?.phoneNumber || "",
    email: customer?.email || "",
    company: customer?.company || "",
    gstin: customer?.gstNumber || "",
    chequePhoto: null,
    address: customer?.address || "",
    apartment: customer?.street || "",
    country: customer?.country || "",
    state: customer?.state || "",
    city: customer?.city || "",
    pinCode: customer?.zipcode || "",
    
  });



  const [rateChartData, setRateChartData] = useState([]);
  const [isChartAvailable, setIsChartAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProduct();
        setProducts(data.data)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchData(); 
  }, []); 

  useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        const response = await getVendorOrdersByVendorId(customer?.vendorId);
        setOrders(response);
        
      } catch (error) {
        console.error("Error fetching vendor orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVendorOrders();
  }, []);
  


  useEffect(() => {
    const fetchRateChart = async () => {
      try {
        const data = await getRateChart(customer?.vendorId);
        if (data && Object.keys(data).length > 0) {
          setRateChartData(data.data.product); // Assuming data format is { productId: [...] }
          setIsChartAvailable(true);
        }
      } catch (error) {
        console.error("Failed to fetch rate chart:", error);
        setIsChartAvailable(false);
      }
    };
  
    fetchRateChart();
  }, [customer?.vendorId]);
  
  
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpand = (key, setter) => {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  


  const toggleProduct = (index) => {
    setExpandedProductIndex(expandedProductIndex === index ? null : index);
    setExpandedVariantIndex({}); // close any open variant when changing product
  };

  const toggleVariant = (productIndex, variantIndex) => {
    const key = `${productIndex}-${variantIndex}`;
    setExpandedVariantIndex((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleType = (pIndex, vIndex, tIndex) => {
  const key = `${pIndex}-${vIndex}-${tIndex}`;
  setExpandedTypeIndex((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));
};




  const handleAddWallet = () =>{
    setManageWallet(!manageWallet)
   }


  const handleStatusChange = (stat) =>{
     setStatus(stat)
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Handle file input separately
    });
  };

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};
  
    if (!formData.firstName.trim()) errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }
    if (!formData.whatsapp.trim()) errors.whatsapp = "WhatsApp number is required.";
    if (!formData.gstin.trim()) errors.gstin = "GSTIN is required.";
    if (!formData.address.trim()) errors.address = "Address is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.state.trim()) errors.state = "State is required.";
    if (!formData.company.trim()) errors.company = "Company is required.";
    if (!formData.apartment.trim()) errors.apartment = "Address is required.";
    if (!formData.state.trim()) errors.state = "State is required.";
    if (!formData.country.trim()) errors.country = "Country is required.";
    if (!formData.pinCode.trim()) {
      errors.pinCode = "Pin code is required.";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      errors.pinCode = "Enter a valid 6-digit pin code.";
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };
  

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validateForm()) return; 

    if (state?.index !== undefined) {

    const newCustomer = {
        firstName: formData.firstName, 
        lastName:formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        whatsappNumber:formData.whatsapp,
        gstNumber:formData.gstin,
        status:status.toUpperCase(),
        vendorType:tag.toUpperCase(),
        zipcode:formData.pinCode,
        street:formData.apartment,
        ...formData,
        };


        await updateVendor(customer.vendorId,newCustomer);
        
      } else {
        
        const newCustomer = {
            firstName: formData.firstName, 
            lastName:formData.lastName,
            email: formData.email,
            phoneNumber: formData.phone,
            whatsappNumber:formData.whatsapp,
            gstNumber:formData.gstin,
            status:status.toUpperCase(),
            vendorType:tag.toUpperCase(),
            zipcode:formData.pinCode,
            street:formData.apartment,
            ...formData,
          };
        
          await addVendor(newCustomer)

      }

      navigate('/spinners-and-dyers')
};

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };



const handleTag = (value) =>{
    setTag(value)
}

  const handleDelete = async() =>{
    const confirmed = window.confirm("Are you sure you want to delete this Account?");
    if (!confirmed) return;

        try {
            const id = customer.vendorId
            await deleteVendor(id)
            navigate('/spinners-and-dyers'); 
        } catch (error) {
            
            console.error('Error Deleting Segment:', error);
        }
     }

     const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
    
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
    
      // Group data by Product ID
      const groupedByProductId = {};
    
      json.forEach((item) => {
        const productId = item["Product ID"];
        if (!groupedByProductId[productId]) {
          groupedByProductId[productId] = [];
        }
    
        groupedByProductId[productId].push({
          variantId: item["Variant ID"],
          size: item["Size"],
          color: {
            colorName: item["Color Name"],
            hexCode: item["Color Hex Code"] || "#000000",
          },
          variantType: item["Variant Type"],
          ratePerKg: parseFloat(item["Rate Per Kg"]),
          gstOnVariant: parseFloat(item["GST % on Variant"]),
        });
      });
    
      // Save to state
      setRateChartData(groupedByProductId);
    };
    
  
    const handleSubmitForm = async () => {
      try {
        const productIds = Object.keys(rateChartData);
    
        for (const productId of productIds) {
          const chartData = rateChartData[productId];
          if (!Array.isArray(chartData) || chartData.length === 0) continue;
    
          const gstOnProduct = chartData[0]?.gstOnVariant || 0;
    
          const payload = {
            productId: Number(productId),
            gstOnProduct: Number(gstOnProduct),
            variant: chartData.map((entry) => ({
              variantId: entry.variantId,
              size: entry.size,
              color: {
                colorName: entry.color.colorName,
                hexCode: entry.color.hexCode,
              },
              variantType: entry.variantType,
              ratePerKg: Number(entry.ratePerKg),
            })),
          };
    
          await createVendorRateChart(customer?.vendorId,productId, payload);
        }
    
        alert("Rate chart uploaded successfully for all products!");
      } catch (err) {
        console.error("Error uploading rate chart:", err.response?.data || err.message);
        alert("Error uploading rate chart.");
      }
    };
    
    const groupRateChartData = () => {
      const grouped = {};
    
      // If data is in API format (array of products)
      if (Array.isArray(rateChartData)) {
        rateChartData.forEach((product) => {
          const productId = product.productId;
          const variants = product.variant;
    
          if (!Array.isArray(variants)) return;
    
          if (!grouped[productId]) grouped[productId] = {};
    
          variants.forEach((variant) => {
            const { size, variantType } = variant;
    
            if (!grouped[productId][size]) grouped[productId][size] = {};
            if (!grouped[productId][size][variantType]) grouped[productId][size][variantType] = [];
    
            grouped[productId][size][variantType].push({
              ...variant,
              gstOnVariant: product.gstOnProduct, // attach GST
            });
          });
        });
      }
    
      // If data is in uploaded file format (object with productId keys)
      else if (typeof rateChartData === 'object' && rateChartData !== null) {
        Object.entries(rateChartData).forEach(([productId, rows]) => {
          if (!grouped[productId]) grouped[productId] = {};
    
          rows.forEach((row) => {
            const { size, variantType } = row;
    
            if (!grouped[productId][size]) grouped[productId][size] = {};
            if (!grouped[productId][size][variantType]) grouped[productId][size][variantType] = [];
    
            grouped[productId][size][variantType].push(row);
          });
        });
      }
    
      return grouped;
    };
        



    const groupedData = groupRateChartData();

    const handleDownloadRateChart = (products) => {
      if (!Array.isArray(products) || products.length === 0) {
        alert("No products found.");
        return;
      }
    
      const allRows = [];
    
      // Create a map of variantId to { ratePerKg, gstOnVariant } for quick lookup
      const rateMap = {};
      rateChartData.forEach((product) => {
        if (Array.isArray(product.variant)) {
          product.variant.forEach((variant) => {
            rateMap[variant.variantId] = {
              ratePerKg: variant.ratePerKg,
              gstOnVariant: variant.gstOnVariant,
            };
          });
        }
      });
    
      products.forEach((product) => {
        if (Array.isArray(product.variants)) {
          product.variants.forEach((variant) => {
            const rateInfo = rateMap[variant.id] || {}; // find matching rate data by variantId
    
            allRows.push({
              "Product ID": product.id,
              "Product Name": product.productName,
              "Product GST (%)": product.gstOnProduct,
              "Variant ID": variant.id,
              "Size": variant.size,
              "Color Name": variant.color?.colorName || "",
              "Color Hex Code": variant.color?.hexCode || "",
              "Variant Type": variant.variantType,
              "Available Weight (Kg)": variant.availableWeight || "",
              "Rate Per Kg": rateInfo.ratePerKg || "",           // Fill if available
              "GST % on Variant": rateInfo.gstOnVariant || "",   // Fill if available
            });
          });
        }
      });
    
      if (allRows.length === 0) {
        alert("No variants found in the product list.");
        return;
      }
    
      const worksheet = XLSX.utils.json_to_sheet(allRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "VendorRateChartTemplate");
    
      XLSX.writeFile(workbook, "Vendor_Rate_Chart_Template.xlsx");
    };
    

    function getProductNameById(productId) {
      for (let product of products) {
        if (product.id == productId) {
          return product.productName;
        }
      }
      return "Unknown Product";
    }
    



    return (
    <div className='add-spinners'>
        <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
        <span onClick={() => navigate("/spinners-and-dyers")}>
          <IoArrowBackOutline size={25} />
        </span>
        {state?.index !== undefined? (
          <h5>{customer?.firstName+" "+customer?.lastName}</h5>
        ):(
          <h5>New Spinners & Dyers</h5>
        )}
      
      </div>

      <div className='main d-flex gap-3 mt-2'>

    <div className='left'>

    <div className='customer-overview row bg-white p-3 gy-2 rounded'>
    <div className="col-md-6 d-flex flex-column">
        <label>First Name</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        {formErrors.firstName && <p className="text-danger">{formErrors.firstName}</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Last Name</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        {formErrors.lastName && <p className="text-danger">{formErrors.lastName}</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Whatsapp No.</label>
        <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
        {formErrors.whatsapp && <p className="text-danger">{formErrors.whatsapp}</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Calling No.</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        {formErrors.phone && <p className="text-danger">{formErrors.phone}</p>}
    </div>

    <div className="col-md-12 d-flex flex-column">
        <label>Email</label>
        <input type="text" name="email" value={formData.email} onChange={handleChange} />
        {formErrors.email  && <p className="text-danger">{formErrors.email }</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Company</label>
        <input type="text" name="company" value={formData.company} onChange={handleChange} />
        {formErrors.company && <p className="text-danger">{formErrors.company}</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>GSTIN No.</label>
        <input
        className="ps-2"
        type="text"
        name="gstin"
        value={formData.gstin}
        placeholder="Add GSTIN No. to authenticate"
        onChange={handleChange}
        />
         {formErrors.gstin && <p className="text-danger">{formErrors.gstin}</p>}
    </div>

    <div className="media-input-ctn mt-5 p-2 col-md-12">
        <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
        <input type="file" name="chequePhoto" onChange={handleChange} />
        <h4>Add photo of a business PAN</h4>
        </div>
        {formErrors.chequePhoto && <p className="text-danger">{formErrors.chequePhoto}</p>}
    </div>

    <div className="col-md-12 d-flex flex-column">
        <label>Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
        {formErrors.address && <p className="text-danger">{formErrors.address}</p>}
    </div>

    <div className="col-md-12 d-flex flex-column">
        <label>Apartment, Suite, etc.</label>
        <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
        {formErrors.apartment && <p className="text-danger">{formErrors.apartment}</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Country/Region</label>
        <input type="text" name="country" value={formData.country} onChange={handleChange} />
        {formErrors.country && <p className="text-danger">{formErrors.country}</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>State</label>
          <SelectState value={formData.state} onChange={handleChange} />
          {formErrors.state && <p className="text-danger">{formErrors.state}</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} />
        {formErrors.city && <p className="text-danger">{formErrors.city}</p>}
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>PIN code</label>
        <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />
        {formErrors.pinCode && <p className="text-danger">{formErrors.pinCode}</p>}
    </div>

    </div>


     <>


  <div className='bg-white mt-2 p-3 w-100 rounded'>
    <div className='d-flex justify-content-between mb-2'>
      <h5>Price Chart</h5>

      <div className="d-flex gap-1">
     
        <button
          className="export-bttn"
          onClick={() => handleDownloadRateChart( products )}
        >
          Export
          <PiExportBold size={16} />
        </button>
      

      <label className="import-bttn mb-0" style={{ cursor: 'pointer' }}>
        Import
        <CgImport size={16} />
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>
    </div>
    </div>

    

    {rateChartData && Object.keys(rateChartData).length > 0 ?  (
                       <>
                    <div style={{ border: '1px solid #ddd', borderRadius: '1rem', marginTop: '1rem', overflow: 'hidden', }}>
                    <table className="table w-full h-auto">
                        <thead className="table-light fw-normal tablehead">
                          <tr>
                            <th className="py-3 px-4 tablehead">Variant ID</th>
                            <th className="py-3 px-4 tablehead text-center">Color Name</th>
                            <th className="py-3 px-4 tablehead text-center">Hex Code</th>
                            <th className="py-3 px-4 tablehead text-center">Rate/Kg</th>
                            <th className="py-3 px-4 tablehead text-center">GST (%)</th>
                          </tr>
                        </thead>
                        <tbody className="level-expanded">
                          {Object.entries(groupedData).map(([productId, sizes]) => (
                            <React.Fragment key={productId}>
                              {/* Product Row */}
                              <tr className="table-secondary">
                                <td colSpan={5} onClick={() => toggleExpand(productId, setExpandedProducts)} style={{ cursor: "pointer" }}>
                                  {expandedProducts[productId] ? (
                                            <IoIosArrowDown className="inline-block w-4 h-4 mr-1" />
                                          ) : (
                                            <IoIosArrowForward  className="inline-block w-4 h-4 mr-1" />
                                          )} 
                                         {getProductNameById(productId)}
                                </td>
                              </tr>

                              {expandedProducts[productId] &&
                                Object.entries(sizes).map(([size, variantTypes]) => (
                                  <React.Fragment key={`${productId}-${size}`}>
                                    {/* Size Row */}
                                    <tr className="table-light ">
                                      <td colSpan={5} onClick={() => toggleExpand(`${productId}-${size}`, setExpandedSizes)} style={{ cursor: "pointer" }}>
                                        {expandedSizes[`${productId}-${size}`] ? (
                                             <IoIosArrowDown className="inline-block w-4 h-4 mr-1" />
                                          ) : (
                                            <IoIosArrowForward  className="inline-block w-4 h-4 mr-1" />
                                          )} 
                                          {size}
                                      </td>
                                    </tr>

                                    {expandedSizes[`${productId}-${size}`] &&
                                      Object.entries(variantTypes).map(([variantType, rows]) => (
                                        <React.Fragment key={`${productId}-${size}-${variantType}`}>
                                          {/* Variant Type Row */}
                                          <tr>
                                            <td colSpan={5} onClick={() => toggleExpand(`${productId}-${size}-${variantType}`, setExpandedVariants)} style={{ cursor: "pointer" }}>
                                              {expandedVariants[`${productId}-${size}-${variantType}`] ? (
                                             <IoIosArrowDown className="inline-block w-4 h-4 mr-1" />
                                          ) : (
                                            <IoIosArrowForward  className="inline-block w-4 h-4 mr-1" />
                                          )} 
                                           {variantType}
                                            </td>
                                          </tr>

                                          {/* Color Rows */}
                                          {expandedVariants[`${productId}-${size}-${variantType}`] &&
                                            rows.map((row, idx) => (
                                              <tr key={idx}>
                                                <td  className="text-center ">{row.variantId}</td>
                                                <td  className="text-center ">{row.color.colorName}</td>
                                                <td  className="text-center align-middle">
                                                  <div className="d-flex justify-content-center align-items-center gap-2">
                                                    <div
                                                      style={{
                                                        backgroundColor: row.color.hexCode,
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "50%",
                                                        border: "1px solid #ccc",
                                                      }}
                                                    />
                                                    <code>{row.color.hexCode}</code>
                                                  </div>
                                                </td>
                                                <td  className="text-center ">{row.ratePerKg}</td>
                                                <td  className="text-center ">{row.gstOnVariant}</td>
                                              </tr>
                                            ))}
                                        </React.Fragment>
                                      ))}
                                  </React.Fragment>
                                ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                      </div>

                       <div className="d-flex justify-content-end mt-4">    
                      <button className="btn btn-tertiary" onClick={handleSubmitForm}>
                        Submit Rate Chart
                      </button>
                      </div>

                        
                  </>
                  )
                  : (
                    <div className="text-muted text-center mt-4">
                      No rate chart available. Please upload a file to continue.
                      {/* Place your upload component or button here */}
                    </div>
                  )}

  </div>
</>


        <div className='d-flex justify-content-between my-4'>
            <DeleteBtn clickFunction={handleDelete}></DeleteBtn>
            <SubmitBtn text={'Save'} clickFunction={handleSubmit}></SubmitBtn>
        </div>

</div>


    <div className='right'>
        <div className='bg-white p-3 rounded'>
            <h5 className='mb-3'>Status</h5>
    
            <StatusInput status={status} onStatusChange={handleStatusChange}></StatusInput>
        </div>

        <div className='bg-white p-3 rounded mt-2'>
            <h5>Tag</h5>
            <Dropdown   onSelect={handleTag} className='mt-3'>
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2 w-100 mt-1">
                <p className="m-0">{tag}</p>
            </Dropdown.Toggle>

            <Dropdown.Menu className='w-100'>
                <Dropdown.Item eventKey="Spinner">Spinner</Dropdown.Item>
                <Dropdown.Item eventKey="Dyer">Dyer</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </div>

        <div className='bg-white mt-2 p-3 w-100 rounded'>
      <div className='d-flex justify-content-between'>
        <h5>Assigned Orders</h5>
      </div>

      <div>
    {loading ? (
      <div className="text-center py-5">Loading orders...</div>
    ) : orders.length === 0 ? (
      <div className="py-5 text-body-tertiary d-flex flex-column justify-content-center align-items-center">
        <RiFilePaper2Line size={50} />
        <h5 className="fs-6">There's no orders till now!</h5>
      </div>
    ) : (
      orders.slice().reverse().map((order) => {
        const totalWeight = order.vendorOrderVariantResponse.reduce(
          (sum, item) => sum + item.vendorOrderWeight,
          0
        );

        return (
          <div key={order.vendorOrderId} className="mt-3 border-bottom pb-2">
            <div className="fw-semibold text-secondary" style={{ fontSize: "12px" }}>
              PO : {order.correlationId}
            </div>
            <div className="my-2 d-flex justify-content-between gap-3">
              <div className="fw-semibold">V.O ID: {order.vendorOrderId}</div>
              <div>&bull;</div>
              <div>{totalWeight} kg</div>
              <div>&bull;</div>
              <div className="fw-semibold" style={{ color: "#41b788" }}>
                ₹{order.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
    </div>

    </div>

    </div>

        


    </div>
  )
}

export default AddSpinners