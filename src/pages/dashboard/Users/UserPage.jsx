import React, { useState } from 'react'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import { Link } from 'react-router-dom'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs';


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
        setUsers([...users, users[index]]);
      };


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
            <StatusFilter status={'Active'}></StatusFilter>
        
        </div>

        <div className='table-ctn'>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined On</th>
                        <th>settings</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.joinedOn}</td>
                        <td>
                        <div className="dropdown">
                        <button className="btn border border-0" data-bs-toggle="dropdown" aria-expanded="false">
                            <BsThreeDots size={20} />
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                            <button className="dropdown-item" onClick={() => handleDuplicate(index)}>
                                Duplicate
                            </button>
                            </li>
                            <li>
                            <button className="dropdown-item" onClick={() => handleDelete(index)}>
                                Delete
                            </button>
                            </li>
                        </ul>
                        </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
            </Table>

        </div>


    </div>
  )
}

export default UserPage