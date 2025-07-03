import React, { useState, useEffect, useMemo } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import ModalOrder from '../../../../components/Modal/ModalOrder';
import { LuFileDown } from "react-icons/lu";
// import "./CreateOrder.css";
import { getAllProduct } from '../../../../services/ProductService';
import { getRateChart } from '../../../../services/VendorsService';
import { getAllVendors } from '../../../../services/VendorsService';
import { createVendorOrder } from '../../../../services/OrderService';
import Toast from '../../../../components/Toast/Toast';

const BulkAssignPage = () => {
    const navigate = useNavigate();
    const [showModalOrder, setShowModalOrder] = useState(false);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedSpinner, setSelectedSpinner] = useState(null);
    const [selectedDyer, setSelectedDyer] = useState(null);
    const {state} = useLocation()
    const order =state?.order || {};
    const [orderDetails, setOrderDetails] = useState([]);
    const [rateChartData, setRateChartData] = useState([]);
    const [spinnerRateChart, setSpinnerRateChart] = useState({});
    const [dyerRateChart, setDyerRateChart] = useState({});
    const [isChartAvailable, setIsChartAvailable] = useState(false);
    const [toasts, setToasts] = useState([]);


    const [customer, setCustomer] = useState(null);

    const [allVendors, setAllVendors] = useState([]);
    const [spinnerList, setSpinnerList] = useState([]);
    const [dyerList, setDyerList] = useState([]);
    const [spinnerSearch, setSpinnerSearch] = useState("");
    const [dyerSearch, setDyerSearch] = useState("");
  
 
    const [orderFor, setOrderFor] = useState("Spinner");
  


    useEffect(() => {
        const fetchVendors = async () => {
          try {
            const res = await getAllVendors(); // use service directly
            const vendors = res.data
            setAllVendors(vendors);
      
            const spinners = vendors.filter(v => v.vendorType === "SPINNER");
            const dyers = vendors.filter(v => v.vendorType === "DYER");
      
            setSpinnerList(spinners);
            setDyerList(dyers);
          } catch (error) {
            console.error("Error fetching vendors", error);
          }
        };
      
        fetchVendors();
      }, []);

      console.log(spinnerList,dyerList)

    // Replicate the same product aggregation from CreateOrder
   const aggregateProductData = (productData, orderFor) => {
  return productData.map((product) => {
    const groupedVariants = product.variants.reduce((acc, variant) => {
      const { size, color, availableWeight, id, pricePerKg, markupPricePerKg, variantType } = variant;

      // 🧠 FILTER: Only keep greige colors if Spinner
      if (orderFor === "Spinner" && color.colorName.toLowerCase() !== "greige") return acc;

      if (!acc[size]) {
        acc[size] = {
          id,
          size,
          variants: [],
          totalWeight: 0,
        };
      }

      const hex = color.colorCode?.toLowerCase() || "#ccc";
      const colorKey = `${color.colorName}-${hex}`;

      let colorGroup = acc[size].variants.find(
        (v) => `${v.colorName}-${v.hexCode?.toLowerCase()}` === colorKey
      );

      if (!colorGroup) {
        colorGroup = {
          colorName: color.colorName,
          hexCode: hex,
          variants: [],
        };
        acc[size].variants.push(colorGroup);
      }

      colorGroup.variants.push({
        variantType: variantType?.toLowerCase() || "unknown",
        available: availableWeight,
        price: pricePerKg,
        id,
        markupPricePerKg,
        colorImage:color.colorImage,
      });

      acc[size].totalWeight += Number(availableWeight);

      return acc;
    }, {});

    return {
      productId: product.id,
      productName: product.productName,
      productDescription: product.productDescription,
      productImage: product.productImage,
      compareAtPrice: product.productPrice?.compareAtPrice,
      costPerItemPerKg: product.productPrice?.costPerItemPerKg,
      gstOnProduct: product.gstOnProduct,
      pricePerKg: product.productPrice?.pricePerKg,
      availableStatus: product.availableStatus,
      groupedVariants: Object.values(groupedVariants),
    };
  });
};


    const finalData = useMemo(() => aggregateProductData(productData, orderFor), [productData, orderFor]);



   

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProduct();
                setProductData(data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
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


      useEffect(() => {
        const fetchSpinnerRateChart = async () => {
          if (!selectedSpinner?.vendorId) return;
          try {
            const data = await getRateChart(selectedSpinner.vendorId);
            setSpinnerRateChart(data.data.product || {});
          } catch (error) {
            console.error("Failed to fetch spinner rate chart:", error);
          }
        };
      
        fetchSpinnerRateChart();
      }, [selectedSpinner?.vendorId]);
      
      useEffect(() => {
        const fetchDyerRateChart = async () => {
          if (!selectedDyer?.vendorId) return;
          try {
            const data = await getRateChart(selectedDyer.vendorId);
            console.log(data.data)
            setDyerRateChart(data.data.product || {});
          } catch (error) {
            console.error("Failed to fetch dyer rate chart:", error);
          }
        };
      
        fetchDyerRateChart();
      }, [selectedDyer?.vendorId]);

     
     

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
      
      
      


    const handleReceiveOrder = (order) => {
        console.log(order)
        setOrderDetails(order);
      };


    const handleTypeChange = (productId, size, colorIndex, value) => {
        setSelectedProducts(prev => prev.map(product => {
            if (product.productId === productId && product.size === size) {
                const updatedColors = product.colors.map((color, idx) => 
                    idx === colorIndex ? { ...color, type: value } : color
                );
                return { ...product, colors: updatedColors };
            }
            return product;
        }));
    };

    // Replicate the weight change handler from CreateOrder
    const handleWeightChange = (index, weight) => {
        const updated = [...orderDetails];
        updated[index].weight = weight;
        setOrderDetails(updated);
      };
      

    // Replicate the price calculation from CreateOrder
    const calculatePriceBreakdown = (product, colorObj) => {
        const price = colorObj.price || 0;
        const weight = colorObj.weight || 0;
        const baseTotal = weight * price;
        const gstRate = product.gstOnProduct || 0;
        const gstAmount = (baseTotal * gstRate) / 100;
        
        return {
            baseTotal,
            gstAmount,
            finalTotal: baseTotal + gstAmount,
            gstRate
        };
    };


    
      const filteredSpinners = spinnerList.filter(v =>
        v.status === "ACTIVE" &&
        (
          v.company.toLowerCase().includes(spinnerSearch.toLowerCase()) ||
          v.firstName.toLowerCase().includes(spinnerSearch.toLowerCase())
        )
      );

      const filteredDyers = dyerList.filter(v =>
        v.status === "ACTIVE" &&
        (
          v.company.toLowerCase().includes(dyerSearch.toLowerCase()) ||
          v.firstName.toLowerCase().includes(dyerSearch.toLowerCase())
        )
      );


      const handleSpinnerSelect = (vendor) => {
        setCustomer(vendor); // This triggers useEffect to fetch rate chart
      };
      
      const handleDyerSelect = (vendor) => {
        setCustomer(vendor);
      };
      

      const handleCreateVendorOrders = async () => {
        try {
          if (!orderDetails || !orderDetails.length) return;
      
          const correlationId = `SPIN-DYE-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
          const createdAt = new Date().toISOString();
      
          const buildPayload = (vendorId, rateChart, billingAddressState) => {
             const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
            let totalCgst = 0;
            let totalSgst = 0;
            let totalIgst = 0;
            let totalTransportationCharges = 200;
      
            const missingRates = [];
      
            const vendorOrderVariants = orderDetails.map((item, index) => {
              const rateGstInfo = getRateForVariant(item.variantId, rateChart);
              const rate = rateGstInfo.rate || 0;
              const gstRate = rateGstInfo.gst || 0;
              const weight = item.weight || 0;
              const baseAmount = rate * weight;
      
              if (!rate || rate === 0) {
                missingRates.push({
                  productName: item.productName,
                  size: item.size,
                  color: item.color?.name || "N/A",
                  variantType: item.variantType,
                });
              }
      
              // Tax Calculation
              let cgst = 0, sgst = 0, igst = 0;
              if ((billingAddressState || '').toLowerCase() === "odisha") {
                cgst = (gstRate / 2 / 100) * baseAmount;
                sgst = (gstRate / 2 / 100) * baseAmount;
              } else {
                igst = (gstRate / 100) * baseAmount;
              }
      
              totalCgst += cgst;
              totalSgst += sgst;
              totalIgst += igst;
      
              const totalAmount = baseAmount + cgst + sgst + igst;
      
              return {
                variantId: item.variantId,
                vendorOrderWeight: weight,
                vendorOrderVariantTotalAmount: totalAmount,
                vendorOrderVariantCgst: cgst,
                vendorOrderVariantSgst: sgst,
                vendorOrderVariantIgst: igst,
                status: 'PLACED',
                statusReason: index === 0 ? 'Initial batch' : 'Second batch',
                statusRemark: index === 0 ? 'Urgent delivery required' : 'Standard delivery',
              };
            });
      
            // Show alert and stop if any rates are missing
            if (missingRates.length > 0) {
              
              const message = missingRates.map(m =>
                `Product: ${m.productName}, Size: ${m.size}, Color: ${m.color}, Type: ${m.variantType}`
              ).join('\n');
              showToast(`Please add price chart for selected vendor in spinner&dyer tab`);
              throw new Error("Rate chart entries missing");
            }
      
            const totalAmount = vendorOrderVariants.reduce((acc, v) => acc + v.vendorOrderVariantTotalAmount, 0);
            const quantity = vendorOrderVariants.length;
      
            return {
              vendorId,
              status: 'PLACED',
              totalAmount,
              totalCgst,
              totalSgst,
              totalIgst,
              quantity,
              createdAt,
              correlationId,
              vendorOrderVariants,
            };
          };
      
          if (orderFor === 'Spinner' || orderFor === 'Both') {
            const spinnerPayload = buildPayload(selectedSpinner?.vendorId, spinnerRateChart, selectedSpinner?.state);
            await createVendorOrder(spinnerPayload);
          }
      
          if (orderFor === 'Dyer' || orderFor === 'Both') {
            const dyerPayload = buildPayload(selectedDyer?.vendorId, dyerRateChart, selectedDyer?.state);
            await createVendorOrder(dyerPayload);
          }
      
          console.log('Vendor order(s) created successfully with correlation ID:', correlationId);
          navigate("/vendor-order");
      
        } catch (error) {
          console.error('Failed to create vendor orders:', error);
        }
      };
      
      
      const handleDeleteRow = (indexToDelete) => {
          const updated = orderDetails.filter((_, idx) => idx !== indexToDelete);
          setOrderDetails(updated);
      };


      const calculateInvoiceTotals = (orderDetails, rateChart, vendorState) => {
        let subtotal = 0;
        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        console.log("hello")
      
        for (const item of orderDetails) {
          const { rate, gst } = getRateForVariant(item.variantId, rateChart);
          const weight = item.weight || 0;
          const baseAmount = rate * weight;
          subtotal += baseAmount;

          console.log(item)
          console.log(rate)
      
          if (vendorState?.toLowerCase() === 'odisha') {
            cgst += (gst / 2 / 100) * baseAmount;
            sgst += (gst / 2 / 100) * baseAmount;
          } else {
            igst += (gst / 100) * baseAmount;
          }
        }
      
        const total = subtotal + cgst + sgst + igst;
      
        return {
          subtotal,
          cgst,
          sgst,
          igst,
          total
        };
      };
      
      const {
        subtotal: subtotalForDyer,
        cgst: cgstForDyer,
        sgst: sgstForDyer,
        igst: igstForDyer,
        total: totalForDyer,
      } = calculateInvoiceTotals(orderDetails, dyerRateChart, selectedDyer?.state);
      
      const {
        subtotal: subtotalForSpinner,
        cgst: cgstForSpinner,
        sgst: sgstForSpinner,
        igst: igstForSpinner,
        total: totalForSpinner,
      } = calculateInvoiceTotals(orderDetails, spinnerRateChart, selectedSpinner?.state);
      



    return (
        <div className='create-order'>
         <div className='top d-flex gap-3 mb-2 mt-2' style={{cursor:'pointer'}}>
                    <span onClick={() => navigate('/vendor-order')}><IoArrowBackOutline size={25}/></span>
                   { Object.keys(order).length === 0 ? (
                    <h5 style={{fontSize:'1.2rem'}}>Create Vendor Order</h5>
        
                   ): (
                        <div className='d-flex gap-2'>
                        <h5>{order.orderId}</h5>
                     
                            {/* <p className={order.payment==='Paid' ? 'green' : 'grey'}>{order.payment}</p>
                            <p className={statusClassMap[order.orderStatus]}>{order.orderStatus}</p> 
                       */}
                        </div>
                    )
                   }
                   
                  
                </div>


                <div className="p-3 bg-white rounded mb-2">
                <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center col-12 col-md-12 col-lg-6">

                    {/* Label Div */}
                    <div className="col-2">
                    <label className="form-label fs-6 fw-medium mb-0">Order for:</label>
                    </div>

                    {/* Dropdown + Search Fields Div */}
                    <div className="d-flex flex-column flex-md-row gap-3 flex-grow-1">

                    {/* Dropdown */}
                    <div style={{ minWidth: "150px" }}>
                        <select
                            className="form-select form-select-sm ps-3 pe-5"
                            style={{ height: "38px" }}
                            value={orderFor}
                            onChange={e => setOrderFor(e.target.value)}
                        >
                            <option value="Spinner">Spinner</option>
                            {/* <option value="Dyer">Dyer</option> */}
                            <option value="Both">Both</option>
                        </select>
                        </div>

                    {/* Spinner Search */}
                    {(orderFor === "Spinner" || orderFor === "Both") && (
                        <div className="position-relative flex-grow-1">
                            <input
                            type="text"
                            className="form-control form-control-sm ps-3 pe-5"
                            placeholder="Select Spinner"
                            value={spinnerSearch}
                            onChange={e => setSpinnerSearch(e.target.value)}
                            style={{ height: "38px" }}
                            />
                            <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                            {spinnerSearch && (
                            <ul className="list-group position-absolute w-100 z-3 mt-1">
                                {filteredSpinners.map(v => (
                                <li
                                    key={v.vendorId}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => {
                                    setSelectedSpinner(v);
                                    setSpinnerSearch(`${v.firstName} (${v.company})`);
                                    }}
                                >
                                    {v.firstName} - {v.company}
                                </li>
                                ))}
                            </ul>
                            )}
                        </div>
                        )}


                    {/* Dyer Search */}
                    {(orderFor === "Dyer" || orderFor === "Both") && (
                        <div className="position-relative flex-grow-1">
                            <input
                            type="text"
                            className="form-control form-control-sm ps-3 pe-5"
                            placeholder="Select Dyer"
                            value={dyerSearch}
                            onChange={e => setDyerSearch(e.target.value)}
                            style={{ height: "38px" }}
                            />
                            <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                            {dyerSearch && (
                            <ul className="list-group position-absolute w-100 z-3 mt-1">
                                {filteredDyers.map(v => (
                                <li
                                    key={v.vendorId}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => {
                                    setSelectedDyer(v);
                                    setDyerSearch(`${v.firstName} (${v.company})`);
                                    }}
                                >
                                    {v.firstName} - {v.company}
                                </li>
                                ))}
                            </ul>
                            )}
                        </div>
                        )}

                    </div>
                </div>
                </div>


                    <div className='products bg-white p-4 mb-3 rounded'>
                        <h6>Order Details</h6>
                
                <div className='d-flex justify-content-center gap-2 mb-1 mt-3 border-bottom pb-5'>
                    <div>
                        <button className='btn btn-sm btn-primary' onClick={() => setShowModalOrder(true)}>
                            Browse Color Catalogue
                        </button>
                    </div>
                </div>



   
                    </div>



        <div className="row gx-2">  
             <div className=" mt-2 col-lg-6 col-md-12">
             {selectedSpinner && (
  <>
    <div className="d-flex justify-content-between mt-4">
      <h6>
        Order for: <span className="text-primary">{selectedSpinner.firstName + " " + selectedSpinner.lastName}</span>
      </h6>
      <div
        className="px-2 rounded"
        style={{
          border: "1px solid #93C5FD",
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
        }}
      >
        <p className="m-0">Spinner</p>
      </div>
    </div>

  {Array.isArray(spinnerRateChart) && spinnerRateChart.length > 0 ? (
    <table className="w-100 mt-2 table" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
      <thead>
        <tr>
          <th>Product</th>
          <th>Size</th>
          <th>Variant</th>
          {/* <th>Color</th> */}
          <th>Weight</th>
          <th>Rate</th>
          {selectedSpinner?.state.toLowerCase() === "odisha" ?(
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orderDetails.map((item, index) => {
          const { rate, gst } = getRateForVariant(item.variantId, spinnerRateChart);
          const weight = item.weight || 0;
          const baseAmount = weight * rate;
          const billingState = selectedSpinner.state
          // Tax calculation
          let cgst = 0, sgst = 0, igst = 0;
          if (billingState.toLowerCase() === "odisha") {
            cgst = (gst / 2 / 100) * baseAmount;
            sgst = (gst / 2 / 100) * baseAmount;
          } else {
            igst = (gst / 100) * baseAmount;
          }
      
          const totalAmount = baseAmount + cgst + sgst + igst;

          return (
            <tr key={`spinner-${index}`}>
              <td>{item.productName}</td>
              <td>{item.size}</td>
              <td>{item.variantType}</td>
              {/* <td>
                <div className="d-flex align-items-center gap-2">
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: item.color.hex,
                      border: "1px solid #ddd",
                    }}
                  ></span>
                  {item.color.name}
                </div>
              </td> */}
              <td style={{width:"6rem"}}>
                <input
                  type="number"
                  className="form-control form-control-sm p-1"
                  value={item.weight || ""}
                  min={0}
                  onChange={(e) =>
                    handleWeightChange(index, parseFloat(e.target.value || 0))
                  }
                />
              </td>
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
            <button
              type="button"
              className="btn btn-sm text-danger"
              onClick={() => handleDeleteRow(index)}
            >
              ✕
            </button>
          </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    ) : (
        <p className="mt-2 text-muted">Rate chart not available for this spinner.</p>
      )}
  </>
)}





        <div className='bg-white rounded  p-3 mt-2'>
        
                    <div className='d-flex justify-content-between' style={{ fontSize: '1rem', fontWeight: 500 }}>
                            <h6>Payment</h6>
                           
                            {/* <div className='bg-secondary-subtle rounded-circle d-flex justify-content-center align-items-center text-white'  style={{ width: '2.5rem', height: '2.5rem' }}><LuFileDown size={20}/></div> */}
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
                            <td>{orderDetails.length}</td>
                            <td style={{ textAlign: 'end' }}>₹{subtotalForSpinner?.toFixed(2)}</td>
                        </tr>
                        {selectedSpinner?.state.toLowerCase() === 'odisha' ? (
                            <>
                            <tr>
                                <td>CGST</td>
                                <td></td>
                                <td style={{ textAlign: 'end' }}>₹{cgstForSpinner?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>SGST</td>
                                <td></td>
                                <td style={{ textAlign: 'end' }}>₹{sgstForSpinner?.toFixed(2)}</td>
                            </tr>
                            </>
                        ) : (
                            <tr>
                            <td>IGST</td>
                            <td></td>
                            <td style={{ textAlign: 'end' }}>₹{igstForSpinner?.toFixed(2)}</td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="2" className="font-weight-bold">Total</td>
                            <td style={{ textAlign: 'end' }}>₹{totalForSpinner?.toFixed(2)}</td>
                        </tr>
                        </tfoot>
                    </table>
        
                           
                           
                    </div>


       

        </div>

        <div className='mt-2 col-lg-6 col-md-12'>
                    

        {selectedDyer && (
  <>
    <div className="d-flex justify-content-between mt-4">
      <h6>
        Order for: <span className="text-warning">{selectedDyer.firstName + " " +selectedDyer.lastName}</span>
      </h6>
      <div
        className="px-2 rounded"
        style={{
          border: "1px solid #FCD34D",
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        }}
      >
        <p className="m-0">Dyer</p>
      </div>
    </div>

    {Array.isArray(dyerRateChart) && dyerRateChart.length > 0 ? (
    <table className="w-100 mt-2 table" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
      <thead>
        <tr>
          <th>Product</th>
          <th>Size</th>
          <th>Variant</th>
          <th>Color Name</th>
           <th>Color Code</th>
          <th>Weight</th>
          <th>Rate</th>
          {selectedDyer?.state.toLowerCase() === "odisha" ?(
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
        </tr>
      </thead>
      <tbody>
        {orderDetails.map((item, index) => {
          const { rate, gst } = getRateForVariant(item.variantId, dyerRateChart);
          const weight = item.weight || 0;
          const baseAmount = weight * rate;
      
          const billingState = selectedDyer.state

          // Tax calculation
          let cgst = 0, sgst = 0, igst = 0;
          if (billingState.toLowerCase() === "odisha") {
            cgst = (gst / 2 / 100) * baseAmount;
            sgst = (gst / 2 / 100) * baseAmount;
          } else {
            igst = (gst / 100) * baseAmount;
          }
      
          const totalAmount = baseAmount + cgst + sgst + igst;

          return (
            <tr key={`dyer-${index}`} style={{height:'3rem'}}>
              <td>{item.productName}</td>
              <td>{item.size}</td>
              <td>{item.variantType}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  {item.color.name}
                </div>
              </td>
               <td>{item.color.hex}</td>
              <td style={{width:"5rem"}}>
            {orderFor === "Dyer" ? (
                <input
                type="number"
                className="form-control form-control-sm p-1"
                value={item.weight || ""}
                min={0}
                onChange={(e) =>
                    handleWeightChange(index, parseFloat(e.target.value || 0))
                }
                />
            ) : (
                item.weight
            )}
            </td>
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
            </tr>
          );
        })}
      </tbody>
    </table>
      ) : (
        <p className="mt-2 text-muted">Rate chart not available for this spinner.</p>
      )}
  </>
)}



        
        
        
                    <div className='bg-white rounded p-3 mt-2'>
                        <div className='d-flex justify-content-between'style={{ fontSize: '1rem', fontWeight: 500 }}>
                            <h6>Payment</h6>
                           
                            {/* <div className='bg-secondary-subtle rounded-circle d-flex justify-content-center align-items-center text-white'  style={{ width: '2.5rem', height: '2.5rem' }}><LuFileDown size={20}/></div> */}
                        </div>
        
                        <table className='w-100 table border rounded  mt-2' style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                            
                            <tbody>
                            <tr>
                            <td>Subtotal</td>
                            <td>{orderDetails.length}</td>
                            <td style={{ textAlign: 'end' }}>₹{subtotalForDyer?.toFixed(2)}</td>
                        </tr>
                        {selectedDyer?.state.toLowerCase() === 'odisha' ? (
                            <>
                            <tr>
                                <td>CGST</td>
                                <td></td>
                                <td style={{ textAlign: 'end' }}>₹{cgstForDyer?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>SGST</td>
                                <td></td>
                                <td style={{ textAlign: 'end' }}>₹{sgstForDyer?.toFixed(2)}</td>
                            </tr>
                            </>
                        ) : (
                            <tr>
                            <td>IGST</td>
                            <td></td>
                            <td style={{ textAlign: 'end' }}>₹{igstForDyer?.toFixed(2)}</td>
                            </tr>
                        )}
                    
                     
                        <tr>
                            <td colSpan="2" className="font-weight-bold">Total</td>
                            <td style={{ textAlign: 'end' }}>₹{totalForDyer?.toFixed(2)}</td>
                        </tr>
                      
        
        
                            </tbody>
                        </table>
        
                      
        
                    </div>
        
        
        
        
              </div>
              </div>

              <div>
                <button className='btn btn-primary' onClick={handleCreateVendorOrders}>Create Order</button>
              </div>




            <ModalOrder
                show={showModalOrder}
                handleClose={() => setShowModalOrder(false)}
                products={finalData}
                onOrderCreate={handleReceiveOrder}
                addToCart={handleReceiveOrder}
            />

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
    );
};

export default BulkAssignPage;