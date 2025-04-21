import React, { useState , useEffect} from 'react'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import { Link } from 'react-router-dom'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Pagination } from 'react-bootstrap'
import { Dropdown } from 'react-bootstrap'
import "./UserPage.css"
import { getAllUser } from '../../../services/UserService'
import { useNavigate } from 'react-router-dom'

const UserPage = () => {

    const navigate = useNavigate()
    const [users,setUsers] =useState([])
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllUser();
            setUsers(data.data)
            setFilteredData(data.data)
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
      
        fetchData(); 
      }, []); 


    const handleDelete = (index) => {
        setUsers(users.filter((_, i) => i !== index));
      };
    
      const handleDuplicate = (index) => {
        setUsers([users[index],...users]);
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
        
    const handleRowClick = (index) => {
      console.log(index,users)
      navigate('/add-user', { state: { index,users } });
    };


    const handleFilterChange = (filter, value) => {
      const lowercasedValue = value.toLowerCase();
  
      const filtered = users.filter((item) => {
          // if (filter === "Order Id") return item.orderId.toString().includes(value);
          if (filter === "Name") return item.firstName.toLowerCase().includes(lowercasedValue);
          if (filter === "Role") return item.role.toLowerCase().includes(lowercasedValue);
          return true;
      });
  
      setFilteredData(filtered);
      };
  

  return (
    <div className='user-page'>
         <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.2rem'}}>Users</h4>

            <div className='d-flex gap-2'>
                {/* <ExportBtn></ExportBtn> */}

               

                <Link to={'/add-user'}>
                <AddBtn text={"Add User"}></AddBtn>
                </Link>
            </div>
        </div>


        <div className='d-flex gap-2 filter-sec'>
            <div className='w-75'>
            <ProductFilter 
                  filterOptions={["Name","Role"]} 
                  onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
              />
            </div>
         
            <div className='w-25'>
                <StatusFilter status={'Active'}></StatusFilter> 
            </div>
        </div>

        <div className='table-ctn'>
            <Table>
                <thead>
                    <tr>
                        <th style={{ verticalAlign: 'middle'}} >Name</th>
                        <th style={{ verticalAlign: 'middle'}} >Email</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Role</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Status</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Joined On</th>
                        <th style={{width:'1rem'}}></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((user, index) => (
                        <tr key={index}  
                        onClick={() => handleRowClick(index)}
                         >
                        <td style={{ verticalAlign: 'middle'}} >{user.firstName +" "+user.lastName}</td>
                        <td style={{ verticalAlign: 'middle'}} >{user.email}</td>
                        <td style={{ justifyItems: 'center', alignContent:'center'}}>
                        <div
                            style={{
                                width: '6rem',
                                padding: '4px',
                                border: '1px solid',
                                borderRadius: '0.2rem',
                                textAlign: 'center',
                                backgroundColor:
                                   user.role.toLowerCase() === 'owner'
                                    ? '#FEDBDC'
                                    :  user.role.toLowerCase() === 'admin'
                                    ? '#DBEAFE'
                                    :  user.role.toLowerCase() === 'sales'
                                    ? '#FFECFA'
                                    : '#FFFFFF', // Default background color if none match
                                borderColor:
                                   user.role.toLowerCase() === 'owner'
                                    ? '#FD9395'
                                    :  user.role.toLowerCase() === 'admin'
                                    ? '#93C5FD'
                                    :  user.role.toLowerCase() === 'sales'
                                    ? '#F75FFF'
                                    : '#CCCCCC', // Default border color if none match
                                color:
                                   user.role.toLowerCase() === 'owner'
                                    ? '#B91C1C' // Red text for Owner
                                    :  user.role.toLowerCase() === 'admin'
                                    ? '#1E40AF' // Blue text for Admin
                                    :  user.role.toLowerCase() === 'sales'
                                    ? '#7A1E7A' // Purple text for Sales
                                    : '#000000', // Default text color if none match
                              }}
                        >
                            {
                             user.role}
                        </div>
                        </td>
                        <td style={{ justifyItems: 'center', alignContent:'center'}}>
                        <div style={{backgroundColor:user.userStatus.toLowerCase() === 'active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:user.userStatus.toLowerCase()==='active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'6rem' ,padding: '4px'}}>
                        {user.userStatus}
                        </div>
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{new Intl.DateTimeFormat('en-GB').format(new Date(user.createdAt))}</td>
                        <td>
                        <Dropdown align="end" style={{ zIndex: 10 }}>
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


            <div className='d-flex justify-content-end mt-2 pagination'>
            <Pagination>{items}</Pagination>
            </div>



            <div className="data-cards">
            {filteredData.map((user,index) => (
          <div className="data-card" key={index}>

            <div className='d-flex justify-content-between'   onClick={() => handleRowClick(index)}>
                 <h3>{user.firstName +" "+user.lastName}</h3>
                 <p> 
                    <div
                      style={{
                        width: '5rem',
                        padding: '0.1rem 0.5rem',
                        border: '1px solid',
                        borderRadius: '0.2rem',
                        textAlign: 'center',
                        backgroundColor:
                           user.role.toLowerCase() === 'owner'
                            ? '#FEDBDC'
                            :  user.role.toLowerCase() === 'admin'
                            ? '#DBEAFE'
                            :  user.role.toLowerCase() === 'sales'
                            ? '#FFECFA'
                            : '#FFFFFF', // Default background color if none match
                        borderColor:
                           user.role.toLowerCase() === 'owner'
                            ? '#FD9395'
                            :  user.role.toLowerCase() === 'admin'
                            ? '#93C5FD'
                            :  user.role.toLowerCase() === 'sales'
                            ? '#F75FFF'
                            : '#CCCCCC', // Default border color if none match
                        color:
                           user.role.toLowerCase() === 'owner'
                            ? '#B91C1C' // Red text for Owner
                            :  user.role.toLowerCase() === 'admin'
                            ? '#1E40AF' // Blue text for Admin
                            :  user.role.toLowerCase() === 'sales'
                            ? '#7A1E7A' // Purple text for Sales
                            : '#000000', // Default text color if none match
                      }}
                    >
                    {user.role}
                    </div>
                </p>
            </div>

            <p><strong></strong> {user.email}</p>
    

            <p className='fw-medium'><strong></strong></p>

            <p className='text-body-tertiary'>{new Intl.DateTimeFormat('en-GB').format(new Date(user.createdAt))}</p>

          </div>
        ))}
      </div>

        </div>


    </div>
  )
}

export default UserPage