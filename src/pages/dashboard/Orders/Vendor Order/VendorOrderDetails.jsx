import React , { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVendorOrderContext } from "../../../../components/Context/VendorOrderContext";
import { LuFileDown } from "react-icons/lu";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { getRateChart } from "../../../../services/VendorsService";
import { useLocation } from "react-router-dom";
import { getAllProduct } from "../../../../services/ProductService";
import { downloadVendorInvoice } from "../../../../services/InvoiceServices";
import { vendorStatusUpdate } from "../../../../services/VendorsService";

const VendorOrderDetails = () => {
  
  const navigate = useNavigate()
  const { orderId } = useParams();
  const { orders } = useVendorOrderContext();

  const [spinnerOrder,setSpinnerOrder] = useState()
  const [dyerOrder,setDyerOrder] = useState()
 
  const location = useLocation();
  const { relatedOrders } = location.state || {};

  useEffect(() => {
    if (relatedOrders) {
      const foundSpinnerOrder = relatedOrders.find(o => o.vendorType === 'SPINNER');
      const foundDyerOrder = relatedOrders.find(o => o.vendorType === 'DYER');

      setSpinnerOrder(foundSpinnerOrder);
      setDyerOrder(foundDyerOrder);
    }
  }, [relatedOrders]);


  const [spinnerRateChart, setSpinnerRateChart] = useState({});
  const [dyerRateChart, setDyerRateChart] = useState({});

  const [totalsForDyer, setTotalsForDyer] = useState(null);
  const [totalsForSpinner, setTotalsForSpinner] = useState(null);
  
  const [productIdNameMap, setProductIdNameMap] = useState({});

  const [statusUpdates, setStatusUpdates] = useState({});
  const [modalData, setModalData] = useState({ isOpen: false, variantId: null, status: "", vendorOrderId: null });


const initializeProductMap = async () => {
  try {
    const res = await getAllProduct();
    const products = res.data;
    const map = {};
    for (const product of products) {
      map[product.id] = product.productName;
    }
    setProductIdNameMap(map); // ✅ Update state
  } catch (error) {
    console.error('Failed to initialize product map:', error);
  }
};

useEffect(() => {
  initializeProductMap();
}, []);

const getProductNameById = (productId) => {
  return productIdNameMap[productId] || '';
};

  
  
  useEffect(() => {
    const fetchSpinnerRateChart = async () => {
      if (!spinnerOrder?.vendorId) return;
      try {
        const data = await getRateChart(spinnerOrder?.vendorId);
        setSpinnerRateChart(data.data.product || {});
      } catch (error) {
        console.error("Failed to fetch spinner rate chart:", error);
      }
    };
  
    fetchSpinnerRateChart();
  }, [spinnerOrder?.vendorId]);
  
  useEffect(() => {
    const fetchDyerRateChart = async () => {
      if (!dyerOrder?.vendorId) return;
      try {
        const data = await getRateChart(dyerOrder?.vendorId);
        setDyerRateChart(data.data.product || {});
      } catch (error) {
        console.error("Failed to fetch dyer rate chart:", error);
      }
    };
  
    fetchDyerRateChart();
  }, [dyerOrder?.vendorId]);


  useEffect(() => {
    if (
      dyerOrder?.vendorOrderVariantResponse &&
      Array.isArray(dyerRateChart) &&
      dyerRateChart.length > 0
    ) {
      const totals = calculateInvoiceTotals(
        dyerOrder.vendorOrderVariantResponse,
        dyerRateChart,
        extractStateFromAddress(dyerOrder?.vendorAddress)
      );
      setTotalsForDyer(totals);
    }
  }, [dyerOrder, dyerRateChart]);
  


  useEffect(() => {
    if (
      spinnerOrder?.vendorOrderVariantResponse &&
      Array.isArray(spinnerRateChart) &&
      spinnerRateChart.length > 0
    ) {
      const totals = calculateInvoiceTotals(
        spinnerOrder.vendorOrderVariantResponse,
        spinnerRateChart,
        extractStateFromAddress(spinnerOrder?.vendorAddress)
      );
      setTotalsForSpinner(totals);
    }
  }, [spinnerOrder, spinnerRateChart]);
  

  const vendorStatusFlow = [
    "PLACED",
    "CONFIRMED",
    "RECEIVED",
    "RETURNED",
    "REPLACED"
  ];
  
  const vendorStatusOptions = [
    { value: "PLACED", label: "Placed" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "RECEIVED", label: "Received" },
    { value: "RETURNED", label: "Returned" },
    { value: "REPLACED", label: "Replaced" },
    { value: "CANCELLED", label: "Cancelled" }
  ];
  
  const statusClassMap = {
    PLACED: "badge bg-secondary",
    CONFIRMED: "badge bg-info",
    RECEIVED: "badge bg-success",
    RETURNED: "badge bg-danger",
    REPLACED: "badge bg-warning",
    CANCELLED: "badge bg-dark"
  };
  
  

  const calculateInvoiceTotals = (orderDetails, rateChart, vendorState) => {
    let subtotal = 0, cgst = 0, sgst = 0, igst = 0;

    for (const item of orderDetails) {
      const { rate, gst } = getRateForVariant(item.variantId, rateChart);
      const weight = item.vendorOrderWeight || 0;
      const baseAmount = rate * weight;
      subtotal += baseAmount;

      if (vendorState?.toLowerCase() === 'odisha') {
        cgst += (gst / 2 / 100) * baseAmount;
        sgst += (gst / 2 / 100) * baseAmount;
      } else {
        igst += (gst / 100) * baseAmount;
      }
    }

    return { subtotal, cgst, sgst, igst, total: subtotal + cgst + sgst + igst };
  };

  function extractStateFromAddress(address) {
    if (!address || typeof address !== "string") return null;
  
    // Normalize to lowercase and find "pin:"
    const lowerAddress = address.toLowerCase();
    const pinIndex = lowerAddress.indexOf("pin:");
  
    if (pinIndex === -1) return null;
  
    // Get the part before PIN
    const beforePin = address.slice(0, pinIndex).trim();
  
    // Split by comma and filter empty values
    const parts = beforePin.split(",").map(part => part.trim()).filter(Boolean);
  
    if (parts.length < 1) return null;
  
    // The state is typically the last non-empty part before PIN
    const state = parts[parts.length - 1];
  
    return state?.toLowerCase() || null;
  }
  


  const getRateForVariant = (variantId, rateChart) => {
    if (!Array.isArray(rateChart)) return {
      rate: 0,
      gst: 0,
      productName: "",
      colorName: "",
      colorHex: "",
    };
  
    for (const product of rateChart) {
      if (Array.isArray(product.variant)) {
        for (const variant of product.variant) {
          if (variant.variantId === variantId) {
            return {
              rate: variant.ratePerKg || 0,
              gst: product.gstOnProduct || 0,
              productName: product.productName || "",
              colorName: variant.color?.colorName || "",
              colorHex: variant.color?.hexCode || "",
            };
          }
        }
      }
    }
  
    return {
      rate: 0,
      gst: 0,
      productName: "",
      colorName: "",
      colorHex: "",
    };
  };
  
  
  console.log(dyerOrder)
  console.log(dyerRateChart)


  return (
    <div className="order-details">
       <div className='top d-flex justify-content-between mb-2 mt-2' style={{cursor:'pointer'}}>
                    <div className="d-flex gap-2">
                  <span onClick={() => navigate(-1)}><IoArrowBackOutline size={25}/></span>
                
                  <h5>V.O.Id : {relatedOrders[0].correlationId}</h5>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn bg-secondary-subtle">Print</button>
                    <button className="btn bg-secondary-subtle">Share</button>
                  </div>

        </div>

      <div className="row gx-2">  
      <div className=" mt-2 col-lg-5 col-md-12">
        <div className="bg-white p-2 rounded mt-2">
        <div className='d-flex justify-content-between'>
            <h6>Order for: <span className='text-primary'>{spinnerOrder?.vendorName}</span></h6>

            <div className='px-2 rounded' style={{border:'1px solid #93C5FD', backgroundColor:'#DBEAFE',color:'#1E40AF'}}>
                <p className='m-0'>Spinner</p>
            </div>

            </div>
            <table className="w-100 mt-2 table" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Variant</th>
                <th>Weight</th>
                <th>Rate</th>
                {extractStateFromAddress(spinnerOrder?.vendorAddress) === "odisha" ?(
                    <>
                    <th>CGST</th>
                    <th>SGST</th>
                    </>
                ):
                (
                    <th>IGST</th>
                )
                }
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(spinnerRateChart) && spinnerRateChart.length > 0 ? 
              (spinnerOrder.vendorOrderVariantResponse.map((item, index) => {
                const { rate, gst } = getRateForVariant(item.variantId, spinnerRateChart);
                const weight = item.vendorOrderWeight || 0;
                const baseAmount = weight * rate;
                const billingState = extractStateFromAddress(spinnerOrder?.vendorAddress)

              
                // Tax calculation
                let cgst = 0, sgst = 0, igst = 0;
                if (billingState === "odisha") {
                  cgst = (gst / 2 / 100) * baseAmount;
                  sgst = (gst / 2 / 100) * baseAmount;
                } else {
                  igst = (gst / 100) * baseAmount;
                }
            
                const totalAmount = baseAmount + cgst + sgst + igst;
            
                return (
                  <tr key={`spinner-${index}`}>
                    <td>{getProductNameById(item.productId)}</td>
                    <td>{item.size}</td>
                    <td>{item.variantType}</td>
                    <td>
                      {item.vendorOrderWeight}
                    </td>
                    <td>{rate.toFixed(2)}</td>
                    <td>{(gst/2).toFixed(1)}</td>
                    <td>{(gst/2).toFixed(1)}</td>
                    <td>{totalAmount.toFixed(2)}</td>
                    <td>
                    <select
                        value={item.status}
                        className={`form-select form-select p-2 ${statusClassMap[item.status] || ''}`}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const confirmMessage = `Are you sure you want to change the status from "${item.status}" to "${newStatus}"?`;
                          const confirmed = window.confirm(confirmMessage);

                          if (!confirmed) return;

                          const payload = [{
                            vendorOrderVariantId: item.vendorOrderVariantId,
                            status: newStatus,
                            reason: newStatus === "CANCELLED" ? "Vendor cancelled the order" : "Vendor accepted the order",
                            remark: newStatus === "CANCELLED" ? "Order not possible" : "Expected delivery within 7 days"
                          }];

                          try {
                            await vendorStatusUpdate(spinnerOrder.vendorOrderId, payload);

                            // Update local state
                            setSpinnerOrder((prev) => {
                              const updatedVariants = prev.vendorOrderVariantResponse.map((v) =>
                                v.vendorOrderVariantId === item.vendorOrderVariantId
                                  ? { ...v, status: newStatus }
                                  : v
                              );
                              return { ...prev, vendorOrderVariantResponse: updatedVariants };
                            });
                          } catch (error) {
                            alert("Failed to update status. Please try again.");
                          }
                        }}
                      >
                        {vendorStatusOptions.map(({ value, label }) => {
                          const currentStatus = item.status;

                          const currentIndex = vendorStatusFlow.indexOf(currentStatus);
                          const optionIndex = vendorStatusFlow.indexOf(value);

                          const isSame = value === currentStatus;
                          const isPlaced = currentStatus === "PLACED";
                          const isCancelled = currentStatus === "CANCELLED";
                          const isConfirmed = currentStatus === "CONFIRMED";

                          let shouldEnable = false;

                          if (isCancelled) {
                            // Cancelled is final
                            shouldEnable = isSame;
                          } else if (isPlaced) {
                            // During PLACED show only CONFIRMED and CANCELLED
                            shouldEnable = value === "CONFIRMED" || value === "CANCELLED" || isSame;
                          } else if (isConfirmed) {
                            // After CONFIRMED, allow all next statuses (no cancel)
                            shouldEnable = optionIndex > currentIndex || isSame;
                          } else {
                            // Allow only next immediate status (e.g., from REPLACED → DISPATCHED)
                            shouldEnable = optionIndex === currentIndex + 1 || isSame;
                          }

                          return (
                            <option key={value} value={value} disabled={!shouldEnable}>
                              {label}
                            </option>
                          );
                        })}
                      </select>


                    </td>

                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={7}>Loading rate chart...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        <div className='bg-white rounded  p-3 mt-2'>
        
                    <div className='d-flex justify-content-between' style={{ fontSize: '1rem', fontWeight: 500 }}>
                            <h6>Payment</h6>
                           
                            <div className='bg-secondary-subtle rounded-circle p-2 text-white' style={{cursor:'pointer'}} onClick={()=>downloadVendorInvoice(dyerOrder?.vendorOrderId)}><LuFileDown size={20}/></div>
                        </div>
        
                    <table className="w-100 table border rounded mt-2" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {/* <thead className="thead-light">
                        <tr>
                            <th>Description</th>
                            <th>Details</th>
                            <th>Amount</th>
                        </tr>
                        </thead> */}
                        <tbody>
                        <tr>
                            <td>Subtotal</td>
                            <td>items {spinnerOrder?.vendorOrderVariantResponse.length}</td>
                            <td style={{textAlign:'end'}}>{totalsForSpinner?.subtotal.toFixed(0)}</td>
                        </tr>
                        {extractStateFromAddress(spinnerOrder?.vendorAddress) === 'odisha' ? (
                            <>
                            <tr>
                                <td>CGST</td>
                                <td></td>
                                <td style={{ textAlign: 'end' }}>₹{totalsForSpinner?.cgst?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>SGST</td>
                                <td></td>
                                <td style={{ textAlign: 'end' }}>₹{totalsForSpinner?.sgst?.toFixed(2)}</td>
                            </tr>
                            </>
                        ) : (
                            <tr>
                            <td>IGST</td>
                            <td></td>
                            <td style={{ textAlign: 'end' }}>₹{totalsForSpinner?.igst?.toFixed(2)}</td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="2" className="font-weight-bold">Total</td>
                            <td className="font-weight-bold" style={{textAlign:'end'}}>₹{totalsForSpinner?.total.toFixed(0)}</td>
                        </tr>
                        
                        </tfoot>
                    </table>
        
                           
                           
                    </div>


       

        </div>

        <div className='mt-2 col-lg-7 col-md-12'>
                    

          <div className="bg-white p-2 rounded mt-2">
        <div className='d-flex justify-content-between'>
            <h6>Order for: <span className='text-primary'>{dyerOrder?.vendorName}</span></h6>

            <div className='px-2 rounded' style={{border:'1px solid #FCD34D', backgroundColor:'#FEF3C7',color:'#92400E'}}>
                <p className='m-0'>Dyer</p>
            </div>

            </div>
            <table className="w-100 mt-2 table" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
      <thead>
        <tr>
          <th>Product</th>
          <th>Size</th>
          <th>Variant</th>
          <th>Color</th>
          <th>Weight</th>
          <th>Rate</th>
          {extractStateFromAddress(dyerOrder?.vendorAddress) === "odisha" ?(
              <>
               <th>CGST</th>
               <th>SGST</th>
               </>
          ):
          (
              <th>IGST</th>
          )
          }
         
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
      {Array.isArray(dyerRateChart) && dyerRateChart.length > 0 ? 
        (dyerOrder?.vendorOrderVariantResponse.map((item, index) => {
          const { rate, gst ,colorName , colorHex} = getRateForVariant(item.variantId, dyerRateChart);
          const weight = item.vendorOrderWeight || 0;
          const baseAmount = weight * rate;
      
          const billingState = extractStateFromAddress(dyerOrder?.vendorAddress)

          console.log(billingState)

          // Tax calculation
          let cgst = 0, sgst = 0, igst = 0;
          if (billingState === "odisha") {
            cgst = (gst / 2 / 100) * baseAmount;
            sgst = (gst / 2 / 100) * baseAmount;
          } else {
            igst = (gst / 100) * baseAmount;
          }
      
          const totalAmount = baseAmount + cgst + sgst + igst;

          return (
            <tr key={`dyer-${index}`} >
              <td>{getProductNameById(item.productId)}</td>
              <td>{item.size}</td>
              <td>{item.variantType}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: colorHex,
                      border: "1px solid #ddd",
                    }}
                  ></span>
                  {colorName}
                </div>
              </td>
              <td>{item.vendorOrderWeight}</td>
              <td>{rate.toFixed(2)}</td>
              {billingState?.toLowerCase() === "odisha"?(
                  <>
                    <td>{(gst/2).toFixed(1)}</td>
                    <td>{(gst/2).toFixed(1)}</td>
                  </>
              ):(
                  <td>{gst}</td>
              )
            }
              
              <td>{totalAmount.toFixed(2)}</td>
              <td>
              <select
                    value={item.status}
                    className={`form-select form-select p-2 ${statusClassMap[item.status] || ''}`}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const confirmMessage = `Are you sure you want to change the status from "${item.status}" to "${newStatus}"?`;
                      const confirmed = window.confirm(confirmMessage);

                      if (!confirmed) return;

                      const payload = [{
                        vendorOrderVariantId: item.vendorOrderVariantId,
                        status: newStatus,
                        reason: newStatus === "CANCELLED" ? "Vendor cancelled the order" : "Vendor accepted the order",
                        remark: newStatus === "CANCELLED" ? "Order not possible" : "Expected delivery within 7 days"
                      }];

                      try {
                        await vendorStatusUpdate(dyerOrder.vendorOrderId, payload);

                        // Update local state
                        setDyerOrder((prev) => {
                          const updatedVariants = prev.vendorOrderVariantResponse.map((v) =>
                            v.vendorOrderVariantId === item.vendorOrderVariantId
                              ? { ...v, status: newStatus }
                              : v
                          );
                          return { ...prev, vendorOrderVariantResponse: updatedVariants };
                        });
                      } catch (error) {
                        alert("Failed to update status. Please try again.");
                      }
                    }}
                  >
                    {vendorStatusOptions.map(({ value, label }) => {
                      const currentStatus = item.status;

                      const currentIndex = vendorStatusFlow.indexOf(currentStatus);
                      const optionIndex = vendorStatusFlow.indexOf(value);

                      const isSame = value === currentStatus;
                      const isPlaced = currentStatus === "PLACED";
                      const isCancelled = currentStatus === "CANCELLED";
                      const isConfirmed = currentStatus === "CONFIRMED";

                      let shouldEnable = false;

                      if (isCancelled) {
                        // Cancelled is final
                        shouldEnable = isSame;
                      } else if (isPlaced) {
                        // During PLACED show only CONFIRMED and CANCELLED
                        shouldEnable = value === "CONFIRMED" || value === "CANCELLED" || isSame;
                      } else if (isConfirmed) {
                        // After CONFIRMED, allow all next statuses (no cancel)
                        shouldEnable = optionIndex > currentIndex || isSame;
                      } else {
                        // Allow only next immediate status (e.g., from REPLACED → DISPATCHED)
                        shouldEnable = optionIndex === currentIndex + 1 || isSame;
                      }

                      return (
                        <option key={value} value={value} disabled={!shouldEnable}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
              </td>
            </tr>
          );
        })
        ) : (
          <tr>
            <td colSpan={7}>Loading rate chart...</td>
          </tr>
        )}
      </tbody>
    </table>
        </div>
        
        
        
                    <div className='bg-white rounded p-3 mt-2'>
                        <div className='d-flex justify-content-between'style={{ fontSize: '1rem', fontWeight: 500 }}>
                            <h6>Payment</h6>
                           
                            <div className='bg-secondary-subtle rounded-circle p-2 text-white' style={{cursor:'pointer'}} onClick={()=>downloadVendorInvoice(dyerOrder?.vendorOrderId)}><LuFileDown size={20}/></div>
                        </div>
        
                        <table className='w-100 table border rounded mt-2' style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                            
                            <tbody>
                                 <tr>
                                    <td>Subtotal</td>
                                    <td>items {dyerOrder?.vendorOrderVariantResponse.length}</td>
                                    <td style={{textAlign:'end'}}>₹{totalsForDyer?.subtotal.toFixed(0)}</td>
                                </tr>
                                {extractStateFromAddress(dyerOrder?.vendorAddress) === 'odisha' ? (
                            <>
                            <tr>
                                <td>CGST</td>
                                <td></td>
                                <td style={{ textAlign: 'end' }}>₹{totalsForDyer?.cgst.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>SGST</td>
                                <td></td>
                                <td style={{ textAlign: 'end' }}>₹{totalsForDyer?.sgst.toFixed(2)}</td>
                            </tr>
                            </>
                        ) : (
                            <tr>
                            <td>IGST</td>
                            <td></td>
                            <td style={{ textAlign: 'end' }}>₹{totalsForDyer?.igst.toFixed(2)}</td>
                            </tr>
                        )}
        
                                <tr>
                                    <td>Total</td>
                                    <td></td>
                                    <td style={{textAlign:'end'}}>₹{totalsForDyer?.total.toFixed(0)}</td>
                                    
                                </tr>
        
        
        
        
                            </tbody>
                        </table>
        
                      
        
                    </div>
        
        
        
        
              </div>
              </div>
    
    </div>
  );
};

export default VendorOrderDetails;
