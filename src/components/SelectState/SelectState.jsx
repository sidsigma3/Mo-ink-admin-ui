import React, { useState, useEffect } from 'react';

const SelectState = ({ value, onChange }) => {
  const states = [
     "Jammu & Kashmir", "Himachal Pradesh", "Punjab", "Chandigarh", "Uttarakhand",
  "Haryana", "Delhi", "Rajasthan", "Uttar Pradesh", "Bihar", "Sikkim",
  "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura",
  "Meghalaya", "Assam", "West Bengal", "Jharkhand", "Odisha", "Chhattisgarh",
  "Madhya Pradesh", "Gujarat", "Daman & Diu", "Dadra & Nagar Haveli",
  "Maharashtra", "Karnataka", "Goa", "Lakshadweep", "Kerala",
  "Tamil Nadu", "Puducherry", "Andaman & Nicobar Islands", "Telangana",
  "Andhra Pradesh", "Ladakh", "Other Territory", "Centre Jurisdiction"
  
  ];

  const [query, setQuery] = useState(value || '');
  const [filteredStates, setFilteredStates] = useState([]);

  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    const matches = states.filter((state) =>
      state.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredStates(matches);
  };

  const handleSelect = (state) => {
    onChange({ target: { name: "state", value: state } });
    setQuery(state);
    setFilteredStates([]);
  };

  return (
    <div className="position-relative">
      <input
        type="text"
        name="state"
        value={query}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Search state"
        autoComplete="off"
      />
      {filteredStates.length > 0 && query && (
        <ul className="list-group position-absolute w-100 mt-1 border rounded shadow-sm" style={{ zIndex: 1050, maxHeight: '160px', overflowY: 'auto' }}>
          {filteredStates.map((state) => (
            <li
              key={state}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(state)}
              style={{ cursor: 'pointer' }}
            >
              {state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectState;
