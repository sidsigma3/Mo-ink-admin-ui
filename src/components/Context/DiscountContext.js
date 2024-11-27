import React, { createContext, useContext, useState } from "react";

const DiscountContext = createContext();

export const useDiscounts = () => useContext(DiscountContext);

export const DiscountProvider = ({ children }) => {
  const [discountData, setDiscountData] = useState([
    {
      discountCode: "WINTER20",
      status: "Active",
      method: "Code",
      selectedOptionCustomer:'All',
      used: 15,
    },
    {
      discountCode: "BIGDEAL",
      status: "Inactive",
      method: "Automatic",
      selectedOptionCustomer:'Specific customer',
      used: 8,
    },
    {
      discountCode: "SUMMER50",
      status: "Active",
      method: "Code",
      selectedOptionCustomer:'Specific customer segements',
      used: 20,
    },
  ]);

 const addDiscount = (discount) => {
  setDiscountData((prevDiscounts) => {
    if (discount.index !== undefined) {
      // Update existing discount
      return prevDiscounts.map((d, idx) => (idx === discount.index ? discount : d));
    } else {
      // Add new discount
      return [...prevDiscounts, discount];
    }
  });
};


  return (
    <DiscountContext.Provider value={{ discountData, addDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
};
