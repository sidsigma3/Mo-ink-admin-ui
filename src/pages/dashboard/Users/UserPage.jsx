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
    const [users, setUsers] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Name');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const userData = JSON.parse(localStorage.getItem('userData'))

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllUser();
            console.log('Users data:', data);
            setUsers(data.data)
            setFilteredData(data.data)
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
      
        fetchData(); 
    }, []); 

    // Apply filters whenever filter states or users data changes
    useEffect(() => {
        if (users.length > 0) {
            applyCombinedFilter(selectedFilter, searchTerm, selectedStatus);
        }
    }, [users, selectedFilter, searchTerm, selectedStatus]);

    const handleDelete = (index) => {
        // Get the actual user from filteredData and find its index in users
        const userToDelete = filteredData[index];
        const originalIndex = users.findIndex(user => user === userToDelete);
        
        if (originalIndex !== -1) {
            const updatedUsers = users.filter((_, i) => i !== originalIndex);
            setUsers(updatedUsers);
        }
    };

    const handleDuplicate = (index) => {
        // Get the actual user from filteredData
        const userToDuplicate = filteredData[index];
        setUsers([userToDuplicate, ...users]);
    };
        
    const handleRowClick = (index) => {
        // Find the original index in users array
        const originalIndex = users.findIndex(user => user === filteredData[index]);
        console.log(originalIndex, users);
        navigate('/add-user', { state: { index: originalIndex, users } });
    };

    const handleFilterChange = (filter, value) => {
        console.log('Filter changed:', filter, value);
        setSelectedFilter(filter);
        setSearchTerm(value || '');
    };

    const handleStatusChange = (status) => {
        console.log('Status changed:', status);
        setSelectedStatus(status || 'All');
    };

    const applyCombinedFilter = (filter, searchValue, status) => {
        console.log('Applying combined filter:', { filter, searchValue, status });
        
        if (!users || users.length === 0) {
            setFilteredData([]);
            return;
        }

        const lowercasedValue = searchValue?.toLowerCase() || '';

        const filtered = users.filter((user) => {
            // Search filter
            let matchesSearch = true;
            if (searchValue && searchValue.trim() !== '') {
                if (filter === "Name") {
                    matchesSearch = user.firstName?.toLowerCase().includes(lowercasedValue) ||
                                   user.lastName?.toLowerCase().includes(lowercasedValue);
                } else if (filter === "Role") {
                    matchesSearch = user.role?.toLowerCase().includes(lowercasedValue);
                }
            }

            // Status filter
            const userStatus = user.userStatus?.toLowerCase() || '';
            const filterStatus = status?.toLowerCase() || 'all';
            const matchesStatus = filterStatus === 'all' || userStatus === filterStatus;

            const result = matchesSearch && matchesStatus;
            
            // Debug log for first few items
            if (users.indexOf(user) < 3) {
                console.log(`User ${user.firstName}:`, {
                    matchesSearch,
                    matchesStatus,
                    result,
                    userStatus,
                    filterStatus
                });
            }

            return result;
        });

        console.log(`Filtered ${filtered.length} users from ${users.length} total`);
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    const paginationItems = [];

    if (totalPages >= 1) {
        paginationItems.push(
            <Pagination.Prev
                key="prev"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            />
        );

        for (let number = 1; number <= totalPages; number++) {
            paginationItems.push(
                <Pagination.Item 
                    key={number} 
                    active={number === currentPage} 
                    onClick={() => setCurrentPage(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        paginationItems.push(
            <Pagination.Next
                key="next"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            />
        );
    }

    return (
        <div className='user-page'>
            <div className='top d-flex justify-content-between align-items-center mt-3 mb-4 '>
                <h3 className='m-0' style={{fontSize:'1.2rem'}}>Users</h3>

                {(userData.role === "MASTER") && (
                    <div className='d-flex gap-2'>
                      <Link to={'/add-user'} className='text-decoration-none'>
                        <AddBtn text={"Add User"} />
                      </Link>
                    </div>
                )}
            </div>

            <div className='order-filter-cttn d-flex gap-2 mb-2 mt-3 '>
                <div className='col-sm-6 col-md-9'>
                    <ProductFilter  
                        filterOptions={["Name","Role"]} 
                        onFilterChange={handleFilterChange}
                        searchTerm={searchTerm}
                    />
                </div>
             
                <div className='col-sm-6 col-md-3'>
                    <StatusFilter 
                        status={selectedStatus} 
                        onStatusChange={handleStatusChange}
                        statusOptions={['All', 'Active', 'Pending', 'Inactive']}
                    ></StatusFilter> 
                </div>
            </div>
            
            <div className='table-ctn rounded-2'>
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
                        return (
                          <tr
                            key={index}
                            onClick={(e) => !e.target.closest('.dropdown') && handleRowClick(index)}
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
                              borderColor: '#E1A93C',
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
                                  <Dropdown.Item onClick={() => handleDuplicate(index)}>Duplicate</Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleDelete(index)}>Delete</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                </Table>

                <div className="data-cards rounded-4">
                    {currentPageData.map((user,index) => (
                      <div className="data-card" key={index}>

                        <div className='d-flex justify-content-between align-items-center' onClick={() => handleRowClick(index)}>
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
                                      borderColor: '#E1A93C',
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