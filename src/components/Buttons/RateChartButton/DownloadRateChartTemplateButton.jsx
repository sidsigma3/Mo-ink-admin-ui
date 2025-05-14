import React from "react";
import * as XLSX from "xlsx";

// Props: products is an array of product objects (like the one you shared)
const DownloadRateChartTemplateButton = ({ products }) => {
  const handleDownload = () => {
    if (!Array.isArray(products) || products.length === 0) {
      alert("No products found.");
      return;
    }

    const allRows = [];

    products.forEach((product) => {
      if (Array.isArray(product.variants)) {
        product.variants.forEach((variant) => {
          allRows.push({
            "Product ID": product.id,
            "Product Name": product.productName,
            "Product GST (%)": product.gstOnProduct,
            "Variant ID": variant.id,
            "Size": variant.size,
            "Color Name": variant.color?.colorName || "",
            "Color Hex Code": variant.color?.hexCode || "",
            "Variant Type": variant.variantType,
            "Available Weight (Kg)": variant.availableWeight,
            "Rate Per Kg": "",          // to be filled
            "GST % on Variant": "",     // to be filled
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

  return (
    <button onClick={handleDownload} className="bttn bttn-outline">
      Download All Products Rate Chart Template
    </button>
  );
};

export default DownloadRateChartTemplateButton;
