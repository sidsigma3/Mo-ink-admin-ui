import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { getProductById , updateProduct } from "../../services/ProductService";

const CataloguePage = ({ onColorSelect, onClose,variant ,id}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColor, setNewColor] = useState({ colorName: "", hexCode: "" });
  const [customColors, setCustomColors] = useState([]);
  const [tempCustomColors, setTempCustomColors] = useState([]);
  const [searchColor,setSearchColor] = useState('')
  const [selectedColors, setSelectedColors] = useState([]); 

  const handleColorClick = (color) => {
    setSelectedColors((prevColors) => {
      const isAlreadySelected = prevColors.some((c) => c.hexCode === color.hexCode);
      if (isAlreadySelected) {
        return prevColors.filter((c) => c.hexCode !== color.hexCode); // Remove color
      } else {
        return [...prevColors, color]; // Add color
      }
    });
  };

  const handleSaveSelection = () => {
    if (selectedColors.length > 0) {
      onColorSelect(selectedColors);
    }
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewColor((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSaveColor = () => {
  //   if (newColor.colorName && newColor.hexCode) {
  //     setCustomColors([...customColors, newColor]);
  //     setNewColor({ colorName: "", hexCode: "" });
  //     setIsAddingColor(false);
  //   }
  // };

  const handleSaveColor = () => {
    if (newColor.colorName && newColor.hexCode) {
    setTempCustomColors((prev) => [...prev, newColor]);
    setNewColor({ colorName: "", hexCode: "" }); 
    }
};


const handleAddColor = async () => {
  if (tempCustomColors.length === 0) {
    alert("Please select at least one color before adding.");
    return;
  }

  const confirmAdd = window.confirm("Are you sure you want to add these colors as new variants?");
  if (!confirmAdd) return;

  try {
    // Fetch the existing product details
    const response = await getProductById(id);
    const productData = response.data;

    // Extract unique sizes from existing variants
    const uniqueSizes = [...new Set(productData.variants.map(variant => variant.size))];

    // Create new variants by combining new colors with existing sizes
    const newVariants = tempCustomColors.flatMap((color) =>
      uniqueSizes.map((size) => ({
        color: {
          colorName: color.colorName,
          hexCode: color.hexCode,
        },
        size, // Assign existing sizes
        availableWeight: "100", // Default weight
        pricePerKg: 150, // Default price
      }))
    );

    // Append new variants to the product
    const { productTypes, ...cleanedProductData } = productData; // Remove productTypes

    const updatedProductData = {
      ...cleanedProductData,
      productType: productData.productTypes,
      variants: [...productData.variants, ...newVariants],
    };

    console.log(updatedProductData)

    // Send update request to API
    await updateProduct(id, updatedProductData);

    // Update local state
    setCustomColors((prev) => [...prev, ...tempCustomColors]);
    setTempCustomColors([]); // Clear temporary colors
    setIsAddingColor(false); // Switch back to catalog view

    alert("New color variants added successfully!");
   
  } catch (error) {
    console.error("Error adding color variant:", error);
    alert("Failed to add color variant. Please try again.");
  }
};

const handleSearchColor = (e) =>{
  setSearchColor(e.target.value.toLowerCase());
}

console.log(variant)

const filteredVariants = variant.variants.filter((item) =>
  item.colorName.toLowerCase().includes(searchColor) || 
  item.hexCode.toLowerCase().includes(searchColor)
);


  return (
    <div className="text-center" >
    <div className={`${isModalOpen ? "show" : ""}`}>
      <div className="">
        
      </div>
      <div className="text-start">
        {isAddingColor ? (
          <div>
            <div className="mb-3">
              <label className="form-label">Color Name</label>
              <input type="text" name="colorName" value={newColor.colorName} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Hex Code</label>
              <input type="text" name="hexCode" value={newColor.hexCode} onChange={handleInputChange} className="form-control" />
            </div>
            {newColor.hexCode && <div className="border rounded mt-2" style={{ width: '50px', height: '50px', backgroundColor: newColor.hexCode }}></div>}
            <button onClick={handleSaveColor} className="btn btn-primary mt-3">SAVE COLOR</button>

            {tempCustomColors.length > 0 && (
              <div className="mt-4">
                <h5 className="fs-5">Custom Colors:</h5>
                <div className="d-flex flex-wrap gap-2 p-2">
                {tempCustomColors.map((item, index) => (
                   <div key={index} className="border rounded p-2"
                   style={{ 
                    cursor: "pointer", 
                    width: "calc(25% - 10px)"
                  }}
                   >
                   <div className="position-relative w-100" style={{height:'5.5rem'}}>
                   <img src="/wool-item-1.png" className="img-fluid" alt="Product" />
                     <div className="position-absolute top-0 start-0 w-100" style={{height:'5.5rem' , backgroundColor: item.hexCode, mixBlendMode: 'multiply',opacity:0.5 }}>
                     </div>
                   </div>
                   <div className="text-center mt-2">
                     <h5 className="fw-bold">{item.colorName}</h5>
                     <h6 className="text-muted">{item.hexCode}</h6>
                   </div>
                 </div>
                  ))}
                    </div>
              </div>
        )}

          </div>
        ) : (
          <div>
            <div>
              <input className="w-100 p-2 rounded border  mb-4" onChange={(e)=>handleSearchColor(e)} placeholder="Search by name or hexcode"></input>
            </div>
            <div className="d-flex justify-content-between"> 
            <h3 className="h6 fw-semibold border-bottom pb-2">Custom Colors</h3>
            {customColors.length > 0 && (
              <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={() => setIsAddingColor(true)}>
                <FaPlus /> <span>New color</span>
              </button>
            )}
            </div>
            <div className="d-flex flex-wrap gap-2 mt-3">
              {customColors.map((item, index) => (
               <div key={index}
               className={`col-4 border rounded p-2 ${selectedColors.some((c) => c.hexCode === item.hexCode) ? "border-primary" : ""}`}
               onClick={() => handleColorClick(item)}
               style={{ 
                cursor: "pointer", 
                width: "calc(25% - 10px)"
                }}
                >
                <div className="position-relative w-100" style={{height:'5.5rem'}}>
                <img src="/wool-item-1.png" className="img-fluid" alt="Product" />
                  <div className="position-absolute top-0 start-0 w-100" style={{height:'5.5rem' , backgroundColor: item.hexCode, mixBlendMode: 'multiply',opacity:0.5 }}>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <h5 className="fw-bold">{item.colorName}</h5>
                  <h6 className="text-muted">{item.hexCode}</h6>
                </div>
             </div>
              ))}
            </div>
            {customColors.length === 0 && (
              <button className="btn btn-outline-secondary w-100 mt-3" onClick={() => setIsAddingColor(true)}>
                <FaPlus /> Add new color
              </button>
            )}
            <h4 className="h6 fw-semibold mt-4">Preset Catalogue</h4>
            <div className="d-flex gap-2" style={{height:'auto'}}>
              {filteredVariants.map((item, index) => (
                <div key={index} 
                    className={`border rounded p-2 ${selectedColors.some((c) => c.hexCode === item.hexCode) ? "border-primary" : ""}`}
                    onClick={() => handleColorClick(item)}
                    style={{ 
                      cursor: "pointer", 
                      width: "calc(25% - 10px)"  // Adjust width based on the gap 
                    }}
                >
                  <div className="position-relative w-100" style={{height:'5.5rem'}}>
                  <img src="/wool-item-1.png" className="img-fluid" alt="Product" />
                    <div className="position-absolute top-0 start-0 w-100" style={{height:'5.5rem' , backgroundColor: item.hexCode, mixBlendMode: 'multiply',opacity:0.5 }}>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <h5 className="fw-bold">{item.colorName}</h5>
                    <h6 className="text-muted">{item.hexCode}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className=" d-flex justify-content-between py-3">

        {isAddingColor ? (
          <div className="d-flex justify-content-between w-100">
           <button className="btn btn-outline-secondary" onClick={() => setIsAddingColor(false)}>VIEW CATALOGUE</button>
           <button className="btn btn-outline-primary" onClick={isAddingColor ? handleAddColor : () => setIsAddingColor(true)}>{isAddingColor ? "ADD COLOR" : "ADD COLOR"}</button>
          </div>
          ):(
          <div className="d-flex justify-content-between w-100">
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveSelection}>Select color</button>
         </div>
        )
        
      }
       
      </div>
    </div>
  </div>
  );
};

export default CataloguePage;
