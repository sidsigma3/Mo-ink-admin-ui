import React, { createContext, useState, useContext } from "react";

// Initial Data
const initialBulkAssignData = [
  {
    cutton: [
      {
        "2/74": [
          {
            color: "yellow",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "pink",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "orange",
            inventory: "265kg",
            unAssigned: "135kg",
          },
        ],
      },
      {
        "2/92": [
          {
            color: "yellow",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "pink",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "orange",
            inventory: "265kg",
            unAssigned: "135kg",
          },
        ],
      },
      {
        "2/42": [
          {
            color: "yellow",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "pink",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "orange",
            inventory: "265kg",
            unAssigned: "135kg",
          },
        ],
      },
    ],
  },
  {
    linen: [
      {
        "2/74": [
          {
            color: "yellow",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "pink",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "orange",
            inventory: "265kg",
            unAssigned: "135kg",
          },
        ],
      },
      {
        "2/92": [
          {
            color: "yellow",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "pink",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "orange",
            inventory: "265kg",
            unAssigned: "135kg",
          },
        ],
      },
      {
        "2/42": [
          {
            color: "yellow",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "pink",
            inventory: "265kg",
            unAssigned: "135kg",
          },
          {
            color: "orange",
            inventory: "265kg",
            unAssigned: "135kg",
          },
        ],
      },
    ],
  },
];

// Context Creation
const BulkAssignContext = createContext();

// Provider Component
export const BulkAssignProvider = ({ children }) => {
  const [bulkAssignData, setBulkAssignData] = useState(initialBulkAssignData);

  // Add additional methods to manipulate data if needed
  const addItem = (type, item) => {
    const updatedData = bulkAssignData.map((category) => {
      if (category[type]) {
        category[type].push(item);
      }
      return category;
    });
    setBulkAssignData(updatedData);
  };

  return (
    <BulkAssignContext.Provider value={{ bulkAssignData, addItem }}>
      {children}
    </BulkAssignContext.Provider>
  );
};

// Custom Hook for Accessing Context
export const useBulkAssign = () => useContext(BulkAssignContext);

