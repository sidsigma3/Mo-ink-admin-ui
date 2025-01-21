import React, { createContext, useState, useContext } from 'react';

// Create the context
const VendorOrderContext = createContext();

// Context provider
export const VendorOrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      orderId: "12345",
      date: "2025-01-01",
      orderFor: "Spinner",
      customer: "John Doe",
      weight: "5 kg",
      amount: "₹5000",
      payment: "Paid",
      po: "PO123",
      details: [
        { productName: "Cotton", size: "M", color: "Red", quantity: 5 },
        { productName: "Yarn", size: "L", color: "Blue", quantity: 10 },
      ],
    },
    {
      orderId: "12346",
      date: "2025-01-02",
      orderFor: "Dyer",
      customer: "Jane Smith",
      weight: "10 kg",
      amount: "₹8000",
      payment: "Unpaid",
      po: "PO124",
      details: [
        { productName: "cotton", size: "S", color: "Green", quantity: 8 },
        { productName: "silk", size: "XL", color: "Yellow", quantity: 12 },
      ],
    },

    {
        orderId: "12346",
        date: "2025-01-02",
        orderFor: "Dyer",
        customer: "Jane Smith",
        weight: "10 kg",
        amount: "₹8000",
        payment: "Unpaid",
        po: "PO124",
        details: [
            { productName: "cotton", size: "S", color: "Green", quantity: 8 },
            { productName: "silk", size: "XL", color: "Yellow", quantity: 12 },
          ],
      },


      {
        orderId: "12346",
        date: "2025-01-02",
        orderFor: "Spinner",
        customer: "Jane Smith",
        weight: "10 kg",
        amount: "₹8000",
        payment: "Unpaid",
        po: "PO124",
        details: [
            { productName: "cotton", size: "S", color: "Green", quantity: 8 },
            { productName: "silk", size: "XL", color: "Yellow", quantity: 12 },
          ],
      },


      {
        orderId: "12346",
        date: "2025-01-02",
        orderFor: "Dyer",
        customer: "Jane Smith",
        weight: "10 kg",
        amount: "₹8000",
        payment: "Unpaid",
        po: "PO124",
        details: [
            { productName: "cotton", size: "S", color: "Green", quantity: 8 },
            { productName: "silk", size: "XL", color: "Yellow", quantity: 12 },
          ],
      },


      {
        orderId: "12346",
        date: "2025-01-02",
        orderFor: "Dyer",
        customer: "Jane Smith",
        weight: "10 kg",
        amount: "₹8000",
        payment: "Unpaid",
        po: "PO124",
        details: [
            { productName: "cotton", size: "S", color: "Green", quantity: 8 },
            { productName: "silk", size: "XL", color: "Yellow", quantity: 12 },
          ],
      },
   
  ]);

  return (
    <VendorOrderContext.Provider value={{ orders, setOrders }}>
      {children}
    </VendorOrderContext.Provider>
  );
};


export const useVendorOrderContext = () => useContext(VendorOrderContext);
