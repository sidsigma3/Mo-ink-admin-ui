import React from 'react'
import { useBulkAssign } from '../../../../components/Context/BulkAssignContext'

const BulkAssignPage = () => {

   
const { bulkAssignData, addItem } = useBulkAssign();


  return (
    <div className="row column-gap-2">
    {bulkAssignData.map((product, index) => {
      const productName = Object.keys(product)[0]; // Get the product name (e.g., "cutton", "linen")
      const productDetails = product[productName]; // Get the details of the product

      return (
        <div key={index} className="col bg-white ">
          <h4>{productName}</h4>
          {productDetails.map((type) =>
            {
                const name = Object.keys(type)[0]; // Get the product name (e.g., "cutton", "linen")
                const details = type[name]; 

                return(
                    <div>
                        {name}
                    </div>
                )
            }
           
          )}
          {/* {productDetails.map((type, typeIndex) => (
            <div key={typeIndex} className="type-section">
              {Object.keys(type).map((variant, variantIndex) => (
                <div key={variantIndex} className="variant-section">
                  <h5>{variant}</h5>
                  {type[variant].map((item, itemIndex) => (
                    <div key={itemIndex} className="item-details">
                      <p>Color: {item.color}</p>
                      <p>Inventory: {item.inventory}</p>
                      <p>Unassigned: {item.unAssigned}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))} */}
        </div>
      );
    })}
  </div>
  )
}

export default BulkAssignPage