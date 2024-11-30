import React, { useState } from 'react';
import { Dropdown, Button, Form } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import "./FilterConditions.css"
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";

const indianCitiesAndStates = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur",
  "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna",
  "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Ranchi",
  "Faridabad", "Meerut", "Rajkot", "Varanasi", "Amritsar", "Allahabad",
  "Jodhpur", "Coimbatore", "Vijayawada", "Madurai", "Raipur", "Kota",
  "Guwahati", "Chandigarh", "Solapur", "Hubli", "Dharwad", "Bareilly",
  "Mysore", "Tiruchirappalli", "Tiruppur", "Salem", "Aligarh", "Gurgaon",
  "Noida", "Thiruvananthapuram"
];

const FilterConditions = ({onConditionsChange,condition}) => {
  const [conditions, setConditions] = useState( condition || [
    { field: 'Weight', operator: '', value: '', period: '', chips: [], searchResults: [] },
  ]);

  const updateConditions = (updatedConditions) => {
    setConditions(updatedConditions);
    if (onConditionsChange) {
      onConditionsChange(updatedConditions); // Notify parent about the updated conditions
    }
  };

  const handleAddCondition = () => {
    const newConditions = [...conditions, { field: '', operator: '', value: '', period: '', chips: [], searchResults: [] }];
    updateConditions(newConditions);
  };

  const handleRemoveCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    updateConditions(newConditions);
  };

  const handleFieldChange = (index, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].field = value;
    updatedConditions[index].operator = '';
    updatedConditions[index].value = '';
    updatedConditions[index].period = '';
    updatedConditions[index].chips = [];
    updatedConditions[index].searchResults = [];
    updateConditions(updatedConditions);
  };

  const handleOperatorChange = (index, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].operator = value;
    updateConditions(updatedConditions);
  };

  const handleValueChange = (index, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].value = value;
    updateConditions(updatedConditions);
  };

  const handlePeriodChange = (index, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].period = value;
    updateConditions(updatedConditions);
  };

  const handleSearchInput = (index, searchValue) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].searchResults = indianCitiesAndStates.filter((cityOrState) =>
      cityOrState.toLowerCase().includes(searchValue.toLowerCase())
    );
    updateConditions(updatedConditions);
  };

  const handleAddChip = (index, chip) => {
    const updatedConditions = [...conditions];
    if (!updatedConditions[index].chips.includes(chip)) {
      updatedConditions[index].chips.push(chip);
    }
    updatedConditions[index].searchResults = [];
    updateConditions(updatedConditions);
  };

  const handleRemoveChip = (index, chipIndex) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].chips.splice(chipIndex, 1);
    updateConditions(updatedConditions);
  };


  return (
    <div>
      {conditions.map((condition, index) => (
        <div key={index} className='d-flex gap-3 align-items-center mb-3 justify-content-between'>
          {/* Field Dropdown */}
          <div className='d-flex gap-3'>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic"  variant="light">
              {condition.field || 'Select Field'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFieldChange(index, 'Weight')}>Weight</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFieldChange(index, 'Amount')}>Amount</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFieldChange(index, 'City')}>City</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFieldChange(index, 'State')}>State</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Operator Dropdown */}
          <Dropdown >
            <Dropdown.Toggle id="dropdown-basic"  variant="light">
              {condition.operator || 'Select Operator'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {['Weight', 'Amount'].includes(condition.field) && (
                <>
                  <Dropdown.Item onClick={() => handleOperatorChange(index, 'is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleOperatorChange(index, 'is more than')}>is more than</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleOperatorChange(index, 'is less than')}>is less than</Dropdown.Item>
                </>
              )}
              {['City', 'State'].includes(condition.field) && (
                <Dropdown.Item onClick={() => handleOperatorChange(index, 'is equal to')}>is equal to</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* Value Input */}
          {['Weight', 'Amount'].includes(condition.field) && (
            <input
            className='h-100 m-0 py-2'
              type="text"
              placeholder="Enter value"
              value={condition.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              >
            </input>
          )}

          {['City', 'State'].includes(condition.field) && (
            <div className="position-relative">
              <input
                className='h-100 m-0 py-1'
                type="text"
                placeholder={`Search ${condition.field}`}
                onChange={(e) => handleSearchInput(index, e.target.value)}
              >
              </input>
              {condition.searchResults.length > 0 && (
                <ul className="search-dropdown">
                  {condition.searchResults.map((result, i) => (
                    <li key={i} onClick={() => handleAddChip(index, result)}>
                      {result}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* {condition.chips.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {condition.chips.map((chip, chipIndex) => (
                <span key={chipIndex} className="badge bg-primary d-flex align-items-center">
                  {chip}
                  <AiOutlineClose
                    size={14}
                    className="ms-2 cursor-pointer"
                    onClick={() => handleRemoveChip(index, chipIndex)}
                  />
                </span>
              ))}
            </div>
          )} */}

          {/* Period Dropdown */}
          {['Weight', 'Amount'].includes(condition.field) && (
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic"  variant="light">
                {condition.period || 'Select Period'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handlePeriodChange(index, 'Week')}>Week</Dropdown.Item>
                <Dropdown.Item onClick={() => handlePeriodChange(index, 'Month')}>Month</Dropdown.Item>
                <Dropdown.Item onClick={() => handlePeriodChange(index, 'Year')}>Year</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          </div>
          {/* Remove Condition Button */}
          <button className='border border-0 bg-white text-danger' variant="danger" onClick={() => handleRemoveCondition(index)}>
           <MdOutlineDelete  size={23}/>
          </button>
        </div>
      ))}

      {/* Chips for City/State */}
      {conditions.map((condition, index) =>
        condition.chips.length > 0 ? (
          <div key={`chips-${index}`} className="d-flex flex-wrap gap-2 mb-3">
            {condition.chips.map((chip, chipIndex) => (
              <span key={chipIndex} className="badge bg-light d-flex align-items-center text-black fw-normal border border-secondary">
                {chip}
                <AiOutlineClose
                  size={14}
                  className="ms-2 cursor-pointer"
                  onClick={() => handleRemoveChip(index, chipIndex)}
                />
              </span>
            ))}
          </div>
        ) : null
      )}

      {/* Add Condition Button */}
      <button className='bg-white border border-0 text-primary d-flex-align-items-center' onClick={handleAddCondition}>
          <span><IoMdAddCircleOutline /></span> Add Variant
      </button>
    </div>
  );
};

export default FilterConditions;
