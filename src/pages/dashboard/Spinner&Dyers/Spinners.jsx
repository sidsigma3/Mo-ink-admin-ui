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

const Spinners = () => {

    const [selectedStatus, setSelectedStatus] = useState("View All"); // Default status selection

    const {data,updateData} = useSpinnerDyers ()

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
            <Dropdown onSelect={handleSelect}  size="sm">
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2 w-100 mt-1">
                <p className="m-0">{selectedStatus}</p>
            </Dropdown.Toggle>

            <Dropdown.Menu className='w-100'>
                <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
                <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </div>

        <div className='table-ctn'>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Tag</th>
                        <th>Assign Orders</th>
                        <th>Last Order</th>
                    </tr>
                </thead>
                <tbody>
          {data.map((customer, index) => (
            <tr key={index} onClick={() => handleRowClick(index)} style={{ cursor: "pointer" }}>
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
            </tr>
          ))}
        </tbody>
                </Table>

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

            {/* <div className='d-flex justify-content-between mt-2 pe-4'>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:product.status === 'Active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:product.status==='Active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'100%'}}>
                    {product.status}
                    </div>
                </p>
                 <p>{product.stock} Kgs</p>
            </div> */}
          </div>
        ))}
      </div>

        </div>
        
    </div>
  )
}

export default Spinners