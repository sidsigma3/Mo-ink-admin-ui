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
    console.log(selectedColors)
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
    const { colorName, hexCode } = newColor;
  
    if (colorName && hexCode) {
      const colorWithDetails = {
        colorName,
        hexCode,
        price: 150, // fixed value
        available: 100, // fixed value
        costPerKg: 200,
        markupPricePerKg: 200,
      };
  
      setTempCustomColors((prev) => [...prev, colorWithDetails]);
      setNewColor({ colorName: "", hexCode: "" });
    } else {
      alert("Please enter both color name and hex code");
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
      const response = await getProductById(id);
      const productData = response.data;
      const uniqueSizes = [...new Set(productData.variants.map(v => v.size))];
  
      const newVariants = tempCustomColors.flatMap((color) =>
        uniqueSizes.map((size) => ({
          size,
          color: {
            colorName: color.colorName,
            hexCode: color.hexCode,
          },
          availableWeight: 100,
          pricePerKg: 150,
          costPerKg: 200,
          markupPricePerKg: 250,
        }))
      );
  
      const originalGrouped = productData.groupedVariants || [];
      const isNewVariant = (variant) => {
        const group = originalGrouped.find(g => g.size === variant.size);
        return !group?.variants.some(
          existing =>
            existing.colorName.toLowerCase() === variant.color.colorName.toLowerCase() &&
            existing.hexCode.toLowerCase() === variant.color.hexCode.toLowerCase()
        );
      };
  
      const filteredNewVariants = newVariants.filter(isNewVariant);
      if (filteredNewVariants.length === 0) {
        alert("All selected variants already exist.");
        return;
      }
  
      const formattedData = {
        title: productData.productName,
        description: productData.productDescription,
        media: productData.productImage || [],
        availableStatus: productData.availableStatus,
        gstOnProduct: Number(productData.gstOnProduct || 0),
        productType: productData.productTypes || {
          productName: productData.productName,
          description: productData.productDescription,
        },
        variants: filteredNewVariants,
        deletedVariantIds: [],
      };
  
      await updateProduct(id, formattedData);

// ✅ Refetch product with updated variants
const updatedProductRes = await getProductById(id);
const updatedVariants = updatedProductRes.data.variants || [];

// ✅ Build a Set to track added hex codes
const seenHexCodes = new Set();
const updatedColorsWithIds = [];

updatedVariants.forEach(variant => {
  const hexCode = variant.color.hexCode.toLowerCase();

  if (!seenHexCodes.has(hexCode)) {
    const match = tempCustomColors.find(
      temp =>
        temp.colorName.toLowerCase() === variant.color.colorName.toLowerCase() &&
        temp.hexCode.toLowerCase() === variant.color.hexCode.toLowerCase()
    );

    if (match) {
      updatedColorsWithIds.push({
        ...match,
        id: variant.id, // ✅ now storing variant id instead of color id
      });

      seenHexCodes.add(hexCode);
    }
  }
});

// ✅ Add to selected customColors
setCustomColors((prev) => [...prev, ...updatedColorsWithIds]);
setTempCustomColors([]);
setIsAddingColor(false);
alert("New color variants added successfully!");

  
    } catch (error) {
      console.error("Error adding color variant:", error);
      alert("Failed to add color variant. Please try again.");
    }
  };
  

const handleSearchColor = (e) =>{
  setSearchColor(e.target.value.toLowerCase());
}

const filteredVariants = variant.variants.filter((item) =>
  item.colorName.toLowerCase().includes(searchColor) || 
  item.hexCode.toLowerCase().includes(searchColor)
);

const height = window.matchMedia("(max-width: 768px)").matches ? "60%" : "50%";


  console.log(customColors)
  console.log(tempCustomColors)

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
                     <h5 className="text-muted text-md" style={{fontSize:'0.8rem'}}>{item.hexCode}</h5>
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
                  <h6 className="text-muted text-md" style={{fontSize:'0.8rem'}}>{item.hexCode}</h6>
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
            <div className="container" style={{height:"20rem", overflow:"auto"}}>
            <div className="row g-0" style={{height:'auto'}}>
              {filteredVariants.map((item, index) => (
                <div key={index} 
                    className={`col-3 col-sm-3 col-md-3 col-lg-2 border rounded p-2   ${selectedColors.some((c) => c.hexCode === item.hexCode) ? "border-primary" : ""}`}
                    onClick={() => handleColorClick(item)}
                    style={{ 
                      cursor: "pointer", 
                      // width: "calc(25% - 10px)"  // Adjust width based on the gap 
                    }}
                > 
                  <div className="position-relative w-100" style={{height:'63%'}}>
                  <img src="/wool-item-1.png" className="img-fluid" alt="Product" style={{objectFit:'cover',height:'100%'}}/>
                    <div className="position-absolute top-0 start-0 w-100" style={{height:'100%' , backgroundColor: item.hexCode, mixBlendMode: 'multiply',opacity:0.5 }}>
                    </div>
                  </div>
                  <div className="text-center mt-2" >
                    <h5 className="fw-bold" style={{fontSize:"0.8rem"}}>{item.colorName}</h5>
                    <h6 className="text-muted text-sm" style={{fontSize:'0.8rem'}}>{item.hexCode}</h6>
                  </div>
                </div>
              ))}
            </div>
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
