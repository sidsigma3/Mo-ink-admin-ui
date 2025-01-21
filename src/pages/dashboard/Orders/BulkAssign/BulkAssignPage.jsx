import React ,{useState,useEffect} from 'react'
import { useBulkAssign } from '../../../../components/Context/BulkAssignContext'
import BulkAssignBox from '../../../../components/BulkAssignBox/BulkAssignBox';

const BulkAssignPage = ({setOrders}) => {
   
const { bulkAssignData, addItem } = useBulkAssign();
const [showAssign, setShowAssign] = useState({}); // State for showing product details
const [selectedDetails, setSelectedDetails] = useState({})
const [selectedSize, setSelectedSize] = useState({})

const [orderList, setOrderList] = useState([]);

useEffect(() => {
    const initialShowAssign = bulkAssignData.reduce((acc, _, idx) => {
      acc[idx] = false; // Initialize each index to false
      return acc;
    }, {});
    setShowAssign(initialShowAssign);
  }, [bulkAssignData]);

  const handleRowClick = (index,details,name) => {
    setShowAssign((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle visibility of the clicked index
    }));
    if (details) {
        setSelectedDetails((prev) => ({
          ...prev,
          [index]: details, // Store details for the clicked row
        }));
        setSelectedSize((prev)=>({
            ...prev,
            [index]:name,
        }))
      }
  };

  const handleBack = (index) =>{
        setShowAssign((prev) => ({
            ...prev,
            [index]:!prev[index]
        }))
  }


  return (
        <div className="row">
            {bulkAssignData.map((product, index) => {
            const productName = Object.keys(product)[0]; // Get the product name (e.g., "cutton", "linen")
            const productDetails = product[productName]; // Get the details of the product
            
            return (
                <div
                key={index}
                className="col-lg-4 col-md-6 p-2"
                style={{height:'15rem'}}
              >
                {/* Conditionally render content */}
                {showAssign[index] ? ( // Check if true, show BulkAssignBox
                  <div className="bg-white p-3 rounded h-100">
                    <BulkAssignBox 
                    size={selectedSize[index] || ''}
                    sizeData={selectedDetails[index] || {}} // Pass details to BulkAssignBox
                    handleBack={()=>handleBack(index)}
                    productName={productName}
                    setOrderList={setOrderList}
                    setOrders={setOrders}
                />
                  </div>
                ) : (
                  // Default View
                  <div className="bg-white p-3 rounded h-100 d-flex flex-column justify-content-between">
                    <h4 className='fs-6'>{productName}</h4>
                    {productDetails.map((type, idx) => {
                      const name = Object.keys(type)[0];
                      const details = type[name];
                      return (
                        <div key={idx} className="product-type mt-1" onClick={() => handleRowClick(index,details,name)} style={{ cursor: "pointer" }}>
                          {name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

      );
    })}
  </div>
  )
}

export default BulkAssignPage