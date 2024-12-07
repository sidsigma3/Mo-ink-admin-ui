import React,{useState} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import { Link } from 'react-router-dom'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import { Dropdown, Table } from 'react-bootstrap'
import { useSpinnerDyers } from '../../../components/Context/SpinnersAndDyersContext';
import { useNavigate } from 'react-router-dom'
import { LuDot } from "react-icons/lu";
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Pagination } from 'react-bootstrap'
import { BsThreeDotsVertical } from "react-icons/bs";

const Spinners = () => {

    const [selectedStatus, setSelectedStatus] = useState("View All"); // Default status selection

    const {data,setData} = useSpinnerDyers ()

    const navigate = useNavigate()

    const handleSelect = (status) => {
        setSelectedStatus(status);
        // if (onStatusChange) onStatusChange(status); // Pass selected status to parent
    };

  const [customers, setCustomers] = useState([
    {
      name: "John Doe",
      location: "New York",
      tag: "spinner", // Condition: "spinner" or "dyers"
      assignOrders: 5,
      lastOrder: "2024-11-21",
    },
    {
      name: "Jane Smith",
      location: "Los Angeles",
      tag: "dyers", // Condition: "spinner" or "dyers"
      assignOrders: 3,
      lastOrder: "2024-11-19",
    },
  ]);


  const handleRowClick = (index) => {
    navigate('/add-spinner-and-dyers', { state: { index } });
  };


  
  let active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }


  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleDuplicate = (index) => {
    setData([data[index],...data]);
  };

    


  return (
    <div className='spinner-page'>
         <div className='top d-flex justify-content-between'>
            <h4>Spinners & Dyers</h4>

            <div className='d-flex gap-2'>
                <ExportBtn></ExportBtn>

                <ImportBtn></ImportBtn>
        
                <Link to={'/add-spinner-and-dyers'}>
                <AddBtn text={"Add New"}></AddBtn>
                </Link>
            </div>
        </div>

        <div className='w-50 d-flex gap-2'>
            <ProductFilter></ProductFilter>
            {/* <Dropdown onSelect={handleSelect}  size="sm">
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2 w-100">
                <p className="m-0">{selectedStatus}</p>
            </Dropdown.Toggle>

            <Dropdown.Menu className='w-100'>
                <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
                <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown> */}
            <StatusFilter status={'Active'}></StatusFilter>
        </div>

        <div className='table-ctn'>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Tag</th>
                        <th>Assigned Orders</th>
                        <th>Last Order</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
          {data.map((customer, index) => (
            <tr key={index} onClick={(e) => !e.target.closest('.dropdown') && handleRowClick(index)} style={{ cursor: "pointer" }}>
              <td>{customer.name}</td>
              <td>{customer.location}</td>
              <td>
                <div 
                style={{
                    padding:'0.2rem 0.4rem',
                    border:'1px solid',borderRadius:'0.2rem',textAlign:'center',width:'50%',
                    backgroundColor:customer.tag === 'Spinner' ? '#DBEAFE' : '#FEF3C7',
                    borderColor:customer.tag === 'Spinner' ? '#93C5FD' : '#FCD34D' ,
                    color : customer.tag === 'Spinner' ? '#1E40AF' : '#92400E' ,
                }}
                >
               {customer.tag}
               </div>
              </td>
              <td>{customer.assignOrders || 0}</td>
              <td>{customer.lastOrder}</td>
              <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-basic" className='border border-0'>
                        <BsThreeDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleDuplicate(index)}>Duplicate</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(index)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </td>
            </tr>
          ))}
        </tbody>
                </Table>

            <div className='d-flex justify-content-end mt-2'>
            <Pagination>{items}</Pagination>
            </div>


                <div className="data-cards">
        {data.map((customer,index) => (
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{customer.name}</h3>
                 <p> 
                    <div
                     style={{
                        width:'100%',
                        padding:'0.2rem 0.4rem',
                        border:'1px solid',borderRadius:'0.2rem',textAlign:'center',
                        backgroundColor:customer.tag === 'Spinner' ? '#DBEAFE' : '#FEF3C7',
                        borderColor:customer.tag === 'Spinner' ? '#93C5FD' : '#FCD34D' ,
                        color : customer.tag === 'Spinner' ? '#1E40AF' : '#92400E' ,
                    }}
                    >
                    {customer.tag}
                    </div>
                </p>
            </div>

            <p><strong></strong> {customer.phone}</p>
    

            <p className='fw-medium'><strong></strong> {customer.location}</p>

            <p className='text-body-tertiary'>Last Order on {customer.lastOrder}</p>

          </div>
        ))}
      </div>

        </div>
        
    </div>
  )
}

export default Spinners