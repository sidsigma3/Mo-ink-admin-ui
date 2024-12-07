import React, { useState } from 'react'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import { Link } from 'react-router-dom'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Pagination } from 'react-bootstrap'
import { Dropdown } from 'react-bootstrap'

const UserPage = () => {


    const [users,setUsers] =useState([
        {
          name: 'John Doe',
          email: 'johndoe@example.com',
          role: 'Sales',
          joinedOn: '2024-10-10',
        },
        {
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          role: 'Admin',
          joinedOn: '2024-09-15',
        },
        {
          name: 'Alice Johnson',
          email: 'alicejohnson@example.com',
          role: 'Owner',
          joinedOn: '2024-08-20',
        },
      ]);
      


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
        


  return (
    <div className='user-page'>
         <div className='top d-flex justify-content-between'>
            <h4>Users</h4>

            <div className='d-flex gap-2'>
                {/* <ExportBtn></ExportBtn> */}

               

                <Link to={'/add-user'}>
                <AddBtn text={"Invite"}></AddBtn>
                </Link>
            </div>
        </div>


        <div className='w-50 d-flex gap-2'>
            <ProductFilter></ProductFilter>
            {/* <StatusFilter status={'Active'}></StatusFilter> */}
        
        </div>

        <div className='table-ctn'>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined On</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                        <div
                            style={{
                                width: '50%',
                                padding: '0.2rem 0.4rem',
                                border: '1px solid',
                                borderRadius: '0.2rem',
                                textAlign: 'center',
                                backgroundColor:
                                  user.role === 'Owner'
                                    ? '#FEDBDC'
                                    : user.role === 'Admin'
                                    ? '#DBEAFE'
                                    : user.role === 'Sales'
                                    ? '#FFECFA'
                                    : '#FFFFFF', // Default background color if none match
                                borderColor:
                                  user.role === 'Owner'
                                    ? '#FD9395'
                                    : user.role === 'Admin'
                                    ? '#93C5FD'
                                    : user.role === 'Sales'
                                    ? '#F75FFF'
                                    : '#CCCCCC', // Default border color if none match
                                color:
                                  user.role === 'Owner'
                                    ? '#B91C1C' // Red text for Owner
                                    : user.role === 'Admin'
                                    ? '#1E40AF' // Blue text for Admin
                                    : user.role === 'Sales'
                                    ? '#7A1E7A' // Purple text for Sales
                                    : '#000000', // Default text color if none match
                              }}
                        >
                            {
                             user.role}
                        </div>
                        </td>
                        <td>{user.joinedOn}</td>
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


            <div className='d-flex justify-content-end mt-2 pagination'>
            <Pagination>{items}</Pagination>
            </div>



            <div className="data-cards">
            {users.map((user,index) => (
          <div className="data-card" key={index}>

            <div className='d-flex justify-content-between'>
                 <h3>{user.name}</h3>
                 <p> 
                    <div
                     style={{
                        width: '100%',
                        padding: '0.2rem 0.4rem',
                        border: '1px solid',
                        borderRadius: '0.2rem',
                        textAlign: 'center',
                        backgroundColor:
                          user.role === 'Owner'
                            ? '#FEDBDC'
                            : user.role === 'Admin'
                            ? '#DBEAFE'
                            : user.role === 'Sales'
                            ? '#FFECFA'
                            : '#FFFFFF', // Default background color if none match
                        borderColor:
                          user.role === 'Owner'
                            ? '#FD9395'
                            : user.role === 'Admin'
                            ? '#93C5FD'
                            : user.role === 'Sales'
                            ? '#F75FFF'
                            : '#CCCCCC', // Default border color if none match
                        color:
                          user.role === 'Owner'
                            ? '#B91C1C' // Red text for Owner
                            : user.role === 'Admin'
                            ? '#1E40AF' // Blue text for Admin
                            : user.role === 'Sales'
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

            <p className='text-body-tertiary'>{user.joinedOn}</p>

          </div>
        ))}
      </div>

        </div>


    </div>
  )
}

export default UserPage