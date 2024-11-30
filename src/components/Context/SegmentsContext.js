import React, { createContext, useContext, useState } from 'react';

// Create Context
const SegmentsContext = createContext();

// Provider Component
export const SegmentsProvider = ({ children }) => {
    const [rows, setRows] = useState([
        {
          title: 'High Value Orders',
          type: 'Conditional',
          customers: 45,
          conditions: [
            { field: 'Amount', operator: 'is more than', value: '2.5', period: 'Month', chips: [], searchResults: [] },
          ],
        },
        {
          title: 'Frequent Buyers',
          type: 'Label',
          customers: 60,
          conditions: [],
          customer: [
            { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
            { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' },
          ],
        },
        {
          title: 'Heavy Orders',
          type: 'Conditional',
          customers: 30,
          conditions: [
            { field: 'Weight', operator: 'is more than', value: '250', period: 'Month', chips: [], searchResults: [] },
          ],
        },
        {
          title: 'Small Orders',
          type: 'Label',
          customers: 20,
          conditions: [
            { field: 'Weight', operator: 'is less than', value: '140', period: 'Month', chips: [], searchResults: [] },
          ],
        },
      ]);
      

  // Context value with rows and setters
  const value = {
    rows,
    setRows,
  };

  return (
    <SegmentsContext.Provider value={value}>{children}</SegmentsContext.Provider>
  );
};

// Custom Hook for consuming context
export const useSegments = () => {
  const context = useContext(SegmentsContext);
  if (!context) {
    throw new Error('useSegments must be used within a SegmentsProvider');
  }
  return context;
};
