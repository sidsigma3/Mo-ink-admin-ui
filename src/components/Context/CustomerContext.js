import React, { createContext, useState, useContext } from "react";

// Create Customer Context
const CustomerContext = createContext();

// Customer Context Provider
export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91-9876543210",
      wallet: "₹5,000",
      location: "Mumbai",
      lastOrder: "2024-11-15",
      totalOrders:50,
      purchaseData: [
        {
          source: "Admin",
          type: "Credit",
          amount: 2000,
          date: "2024-11-10",
        },
        {
          source: "Customer",
          type: "Debit",
          amount: 1000,
          date: "2024-11-12",
        },
      ],
    },
    {
      name: "Priya Gupta",
      email: "priya.gupta@example.com",
      phone: "+91-8765432109",
      wallet: "₹2,800",
      location: "Delhi",
      lastOrder: "2024-11-10",
      totalOrders:50,
      purchaseData: [
        {
          source: "Admin",
          type: "Credit",
          amount: 1500,
          date: "2024-11-01",
        },
        {
          source: "Customer",
          type: "Debit",
          amount: 700,
          date: "2024-11-05",
        },
      ],
    },
    {
        name: "Amit Patel",
        email: "amit.patel@example.com",
        phone: "+91-7654321098",
        wallet: "₹12,450",
        location: "Ahmedabad",
        lastOrder: "2024-11-20",
        totalOrders:50,
        purchaseData: [
            {
              source: "Admin",
              type: "Credit",
              amount: 1500,
              date: "2024-11-01",
            },
            {
              source: "Customer",
              type: "Debit",
              amount: 700,
              date: "2024-11-05",
            },
          ],
      },

      {
        name: "Sneha Nair",
        email: "sneha.nair@example.com",
        phone: "+91-6543210987",
        wallet: "₹9,600",
        location: "Kochi",
        lastOrder: "2024-11-18",
        totalOrders:50,
        purchaseData: [
            {
              source: "Admin",
              type: "Credit",
              amount: 1500,
              date: "2024-11-01",
            },
            {
              source: "Customer",
              type: "Debit",
              amount: 700,
              date: "2024-11-05",
            },
          ],
      },
      {
        name: "Karan Singh",
        email: "karan.singh@example.com",
        phone: "+91-5432109876",
        wallet: "₹3,300",
        location: "Chandigarh",
        lastOrder: "2024-11-05",
        totalOrders:50,
        purchaseData: [
            {
              source: "Admin",
              type: "Credit",
              amount: 1500,
              date: "2024-11-01",
            },
            {
              source: "Customer",
              type: "Debit",
              amount: 700,
              date: "2024-11-05",
            },
          ],
      },
  ]);

  const addTransaction = (index, transaction) => {
    setCustomers((prev) => {
      const updated = [...prev];
      updated[index].purchaseData.push(transaction);
      return updated;
    });
  };

  return (
    <CustomerContext.Provider value={{ customers, setCustomers, addTransaction }}>
      {children}
    </CustomerContext.Provider>
  );
};

// Hook for using CustomerContext
export const useCustomerContext = () => useContext(CustomerContext);
