import React, { createContext, useState, useContext } from "react";

// Create the context
const SpinnerDyersContext = createContext();

// Provide the context
export const SpinnerDyersProvider = ({ children }) => {
  const [data, setData] = useState([
    {
      name: "Rahul Sharma",
      location: "Mumbai",
      tag: "Spinner",
      assignOrders: 10,
      lastOrder: "2024-11-20",
      phone: "+91-5432109876",
    },
    {
      name: "Priya Gupta",
      location: "Delhi",
      tag: "Dyer",
      assignOrders: 5,
      lastOrder: "2024-11-18",
      phone: "+91-5432109876",
    },
    {
      name: "Amit Patel",
      location: "Ahmedabad",
      tag: "Spinner",
      assignOrders: 8,
      lastOrder: "2024-11-15",
      phone: "+91-5432109876",
    },
    {
      name: "Sneha Nair",
      location: "Kochi",
      tag: "Dyer",
      assignOrders: 12,
      lastOrder: "2024-11-12",
      phone: "+91-5432109876",
    },
  ]);

  // Add or update a row
  const UpdateData = (newEntry) => {
    setData((prev) => {
      const index = prev.findIndex((item) => item.name === newEntry.name);
      if (index !== -1) {
        // Update existing entry
        const updatedData = [...prev];
        updatedData[index] = newEntry;
        return updatedData;
      }
      // Add new entry
      return [...prev, newEntry];
    });
  };

  // Remove a row
  const removeData = (name) => {
    setData((prev) => prev.filter((item) => item.name !== name));
  };

  return (
    <SpinnerDyersContext.Provider value={{ data, setData, removeData }}>
      {children}
    </SpinnerDyersContext.Provider>
  );
};

// Custom hook to use the context
export const useSpinnerDyers = () => {
  return useContext(SpinnerDyersContext);
};
