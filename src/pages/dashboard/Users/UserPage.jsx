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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    const userData = JSON.parse(localStorage.getItem('userData'))

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
  

      const paginationItems = [];

for (let number = 1; number <= totalPages; number++) {
  paginationItems.push(
    <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
      {number}
    </Pagination.Item>
  );
}


  return (
    <div className='user-page'>
         <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.2rem'}}>Users</h4>

            {(userData.role === "MASTER") && (
                <div className='d-flex gap-2'>
                  <Link to={'/add-user'}>
                    <AddBtn text={"Add User"} />
                  </Link>
                </div>
              )}

            
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
            <Table hover>
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
                  {currentPageData.map((user, index) => {
                    const originalIndex = startIndex + index;

                    return (
                      <tr
                        key={originalIndex}
                        onClick={() => handleRowClick(originalIndex)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ verticalAlign: 'middle' }}>{user.firstName + " " + user.lastName}</td>
                        <td style={{ verticalAlign: 'middle' }}>{user.email}</td>
                        <td style={{ justifyItems: 'center', alignContent: 'center' }}>
                          <div
                            style={{
                              width: '6rem',
                              padding: '4px',
                              border: '1px solid',
                              borderRadius: '0.2rem',
                              textAlign: 'center',
                              ...(user.role.toLowerCase().includes('master') ? {
                          backgroundImage: 'linear-gradient(175deg, #F3E47E 30%, #E1A93C 100%)',
                          backgroundColor: '#F3E47E',
                          borderColor: '#ffffff',
                          color: '#7c5d24',
                        } : user.role.toLowerCase().includes('admin') ? {
                          backgroundColor: '#DBEAFE',
                          borderColor: '#93C5FD',
                          color: '#1E40AF',
                        } : user.role.toLowerCase().includes('sales') ? {
                          backgroundColor: '#FFECFA',
                          borderColor: '#F75FFF',
                          color: '#7A1E7A',
                        } : {
                          backgroundColor: '#FFFFFF',
                          borderColor: '#CCCCCC',
                          color: '#000000',
                        })
                    
                            }}
                          >
                            {user.role}
                          </div>
                        </td>
                       <td style={{ justifyItems: 'center', alignContent: 'center' }}>
                          <div
                            style={{
                              backgroundColor:
                                user.userStatus.toLowerCase() === 'active'
                                  ? '#D1FAE5'
                                  : user.userStatus.toLowerCase() === 'pending'
                                  ? '#FEF3C7'
                                  : '#F3F4F6',
                              border: '1px solid',
                              borderColor:
                                user.userStatus.toLowerCase() === 'active'
                                  ? '#6EE7B7'
                                  : user.userStatus.toLowerCase() === 'pending'
                                  ? '#FBBF24'
                                  : '#D1D5DB',
                              borderRadius: '0.2rem',
                              textAlign: 'center',
                              width: '6rem',
                              padding: '4px',
                            }}
                          >
                            {user.userStatus}
                          </div>
                        </td>

                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          {new Intl.DateTimeFormat('en-GB').format(new Date(user.createdAt))}
                        </td>
                        <td>
                          <Dropdown align="end" style={{ zIndex: 10 }}>
                            <Dropdown.Toggle variant="light" id="dropdown-basic" className="border border-0">
                              <BsThreeDotsVertical />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleDuplicate(originalIndex)}>Duplicate</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDelete(originalIndex)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

            </Table>

            <div className="data-cards">
            {filteredData.map((user,index) => (
          <div className="data-card" key={index}>

            <div className='d-flex justify-content-between align-items-center'   onClick={() => handleRowClick(index)}>
                 <h3 className='fs-6 fw-medium	'>{user.firstName +" "+user.lastName}</h3>
                 <p> 
                    <div
                      style={{
                        padding: '0.2rem 0.2rem',
                        fontSize: '0.8rem',
                        width: '7rem',
                        height: '2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '0',
                        fontWeight: '500',
                        border: '1px solid',
                        borderRadius: '0.2rem',
                        
                        ...(user.role.toLowerCase().includes('master') ? {
                          backgroundImage: 'linear-gradient(175deg, #F3E47E 30%, #E1A93C 100%)',
                          backgroundColor: '#F3E47E',
                          borderColor: '#ffffff',
                          color: '#7c5d24',
                        } : user.role.toLowerCase().includes('admin') ? {
                          backgroundColor: '#DBEAFE',
                          borderColor: '#93C5FD',
                          color: '#1E40AF',
                        } : user.role.toLowerCase().includes('sales') ? {
                          backgroundColor: '#FFECFA',
                          borderColor: '#F75FFF',
                          color: '#7A1E7A',
                        } : {
                          backgroundColor: '#FFFFFF',
                          borderColor: '#CCCCCC',
                          color: '#000000',
                        })
                      }}
                    >
                    {user.role}
                    </div>
                </p>
            </div>

            <p className='fw-normal '><strong></strong> {user.email}</p>
    

            <p style={{ fontSize: '0.8rem', color: '#93A3AB', fontWeight: 500 }}> Created on {new Intl.DateTimeFormat('en-GB').format(new Date(user.createdAt))}</p>            

            

          </div>
        ))}
      </div>

        </div>

        <div className="d-flex justify-content-end mt-2 pagination">
        <Pagination>{paginationItems}</Pagination>
      </div>



    </div>
  )
}

export default UserPage