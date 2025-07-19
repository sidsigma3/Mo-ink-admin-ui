import React ,{useState,useEffect} from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import Toast from "../../../components/Toast/Toast";


const BulkAssignBox = ({size,sizeData,handleBack,productName,setOrderList,setOrders}) => {
    const [showAssign, setShowAssign] = useState(false); // State for showing product details
    const [selectedDetails, setSelectedDetails] = useState({})
    const [toasts, setToasts] = useState([]);


    const [quantity,setQuantity] = useState('')

    // useEffect(() => {
    //     const initialShowAssign = sizeData.reduce((acc, _, idx) => {
    //       acc[idx] = false; // Initialize each index to false
    //       return acc;
    //     }, {});
    //     setShowAssign(initialShowAssign);
    //   }, [sizeData]);


      const handleRowClick = (index) => {
        setShowAssign(!showAssign);

        setSelectedDetails(sizeData[index])

        // if (details) {
        //     setSelectedDetails((prev) => ({
        //       ...prev,
        //       [index]: details, // Store details for the clicked row
        //     }));
        //     setSelectedSize((prev)=>({
        //         ...prev,
        //         [index]:name,
        //     }))
        //   }
      };
    

      const handleAddtoCart = () => {
        const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
        if (!quantity || quantity <= 0) {
          showToast("Please enter a valid quantity.", "error");
          return;
        }
      
        setOrderList((prevOrders) => {
          const existingOrderIndex = prevOrders.findIndex(
            (order) =>
              order.productName === productName &&
              order.size === size &&
              order.color === selectedDetails.color
          );
      
          if (existingOrderIndex !== -1) {
            const updatedOrders = [...prevOrders];
            updatedOrders[existingOrderIndex].quantity += parseInt(quantity, 10);
            setOrders(updatedOrders)
            return updatedOrders;
          }
          
          const updated = [
            ...prevOrders,
            {
              productName,
              size,
              color: selectedDetails.color,
              quantity: parseInt(quantity, 10),
            },
          ]

          setOrders(updated)
          return updated
        });
      
        setQuantity(""); // Clear the quantity input
        setShowAssign(false); // Return to the previous view
      };


      

  return (
    <div className='h-100'>
        
         {showAssign ? (

            <div className='h-100'>
                <div onClick={()=>setShowAssign(false)}>
                  
                    <IoMdArrowBack />
                   
                    {/* <h5 style={{fontSize:'1rem',right:'-1rem'}} className='fw-normal position-absolute rounded-start-pill border bg-secondary-subtle px-2'>{size}</h5> */}
                </div>

                <div className='mt-2'>
                    <table className='w-100' style={{textAlign:'center', height:'5rem'}}>
                        <thead>
                            <tr className='border-bottom'>
                                <th className='fw-medium' style={{textAlign:'left'}}>Yarn</th>
                                <th className='fw-medium'>Counter</th>
                                <th className='fw-medium'>Color</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className='border-bottom'>
                                <td style={{textAlign:'left'}}>{productName}</td>
                                <td>{size}</td>
                                <td>{selectedDetails.color}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className='mt-3'>
                <div className='d-flex align-items-center justify-content-between'>
                <label>Quantity to order:</label>
                <input onChange={(e)=>setQuantity(e.target.value)} className='rounded border border-secondary-subtle px-1 w-50' type='number'></input>
                </div>
                
                <button onClick={handleAddtoCart} className='btn btn-primary-custom btn-sm w-100 mt-2 d-flex gap-2 justify-content-center'> <span><FiShoppingCart /></span>Add to cart</button>
                </div>
            </div>
    ) :(


    <div className='h-100'>

        <div className='d-flex justify-content-between position-relative'>
            <div onClick={handleBack}>
            <IoMdArrowBack />
            </div>
            <h5 style={{fontSize:'1rem',right:'-1rem'}} className='fw-normal position-absolute rounded-start-pill border bg-secondary-subtle px-2'>{size}</h5>
        </div>

        <div className='h-100'>
            <table className='w-100 h-100' style={{textAlign:'center'}}>
                <thead>
                    <tr className='border-bottom'>
                    <th className='fw-medium' style={{textAlign:'left'}}>
                        Colors
                    </th>
                    <th className='fw-medium'>Inventory</th>
                    <th className='fw-medium'>Unassigned</th>
                    </tr>
                </thead>
                <tbody>
                    {sizeData.map((data,index)=>(
                       <tr key={index} className='border-bottom p-2'  onClick={() => handleRowClick(index)} >
                            <td style={{textAlign:'left'}}>{data.color}</td>
                            <td>{data.inventory}</td>
                            <td>{data.unAssigned}</td>
                       </tr> 
                    ))}
                </tbody>
            </table>
        </div>
    </div>


                )}

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

export default BulkAssignBox