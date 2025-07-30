import React , {useState , useEffect} from 'react'
import AddBtn from '../../../../components/Buttons/Add/AddBtn'
import ExportBtn from '../../../../components/Buttons/Export/ExportBtn'
import { Link ,useNavigate } from 'react-router-dom'
import ProductFilter from '../../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs';
import { useSegments } from '../../../../components/Context/SegmentsContext'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Pagination } from 'react-bootstrap'
import { Dropdown } from 'react-bootstrap'
import { LuDot } from "react-icons/lu";
import "./SegmentsPage.css"
import { getAllSegment } from '../../../../services/SegmentService'

const SegmentsPage = () => {

    const navigate = useNavigate ()
   
    const { rows, setRows } = useSegments();

    const [segments,setSegments] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Active');
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


    
      useEffect(() => {
          const fetchData = async () => {
            try {
              const data = await getAllSegment();
              setSegments(data.data)
              setFilteredData(data.data)
            } catch (error) {
              console.error('Error fetching products:', error);
            }
          };
        
          fetchData(); 
        }, []); 
      

    // const [rows, setRows] = useState([
    //     {
    //       title: 'High Value Orders',
    //       type: 'Automated',
    //       customers: 45,
    //       conditions: 'Order amount more than 2.5L/month',
    //     },
    //     {
    //       title: 'Frequent Buyers',
    //       type: 'Label',
    //       customers: 60,
    //       conditions: 'Friends group',
    //     },
    //     {
    //       title: 'Heavy Orders',
    //       type: 'Automated',
    //       customers: 30,
    //       conditions: 'Order weight more than 250kg/month',
    //     },
    //     {
    //       title: 'Small Orders',
    //       type: 'Label',
    //       customers: 20,
    //       conditions: 'Order weight less than 140kg/month',
    //     },
    //   ]);

      const handleDelete = (index) => {
        setRows(rows.filter((_, i) => i !== index));
      };
    
      const handleEdit = (index, updatedRow) => {
        const updatedRows = [...rows]; // Create a copy of the rows array
        updatedRows[index] = updatedRow; // Update the specific row at the given index
        setRows(updatedRows); // Set the updated rows state
      };

      const formatConditions = (conditions, customer) => {
        if (customer && customer.length > 0) {
          // Label selected, show specific group
          return "Applies to specific group";
        }
      
        if (!conditions || conditions.length === 0) {
          return "No conditions specified";
        }
      
        return conditions
          .map((cond) => {
            if ((cond.field === "City" || cond.field === "State") && cond.chips.length > 0) {
              // Handle places with chips
              return `${cond.chips.join(", ")} ${cond.field}`;
            } else if (cond.field && cond.operator && cond.value) {
              // Handle standard conditions
              const unit =
                cond.field.toLowerCase().includes("weight")
                  ? "kg"
                  : cond.field.toLowerCase().includes("amount")
                  ? "L"
                  : "";
              return `Order ${cond.field.toLowerCase()} ${cond.operator} ${cond.value}${unit}/${cond.period}`;
            } else {
              return ""; // Skip incomplete conditions
            }
          })
          .filter(Boolean) // Remove empty strings
          .join(" and ");
      };

      const handleRowClick = (index) => {
        navigate('/add-segments', { state: { index , segments } });
      };
      

      
        const formatSegmentCondition = (conditionString) => {
          try {
              const conditions = JSON.parse(conditionString); // Convert string back to array
              if (!Array.isArray(conditions) || conditions.length === 0) return "No Conditions";
      
              return conditions.map(condition => {
                  if (condition.field === "City" || condition.field === "State") {
                      return `${condition.field} is ${condition.chips.join(", ")}`;
                  } else {
                      return `${condition.field} ${condition.operator} ${condition.value}`;
                  }
              }).join(" AND ");
          } catch (error) {
              return conditionString;
          }
      };

      const handleFilterChange = (filter, value) => {
        setFilterText(value);
        applyFilters(value, statusFilter); // Re-apply both filters
      };
      
      const handleStatusChange = (status) => {
        setStatusFilter(status);
        applyFilters(filterText, status); // Re-apply both filters
      };
      
      const applyFilters = (text, status) => {
        const lowercasedValue = text.toLowerCase();
      
        const filtered = segments.filter((item) => {
          const titleMatch = item.segmentTitle.toLowerCase().includes(lowercasedValue);
          const statusMatch = status === 'All' || item.segmentStatus === status.toUpperCase();
          return titleMatch && statusMatch;
        });
      
        setFilteredData(filtered);
      };
      

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
    <div className='segments-page'>
           <div className='top d-flex justify-content-between align-items-center mt-3 mb-4 '>
           <h3 className='m-0' style={{fontSize:'1.2rem'}}>Segments</h3>

            <div className='d-flex gap-2'>
                <ExportBtn></ExportBtn>

               

                <Link to={'/add-segments'}>
                <AddBtn text={"Add New"}></AddBtn>
                </Link>
            </div>

        </div>

        <div className='order-filter-cttn d-flex gap-2 mb-2 mt-3 '>
                            <div className='col-sm-6 col-md-9'>
                                <ProductFilter 
                  filterOptions={["Title"]} 
                  onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
              />
            </div>
         
            <div className='col-sm-6 col-md-3'>
                <StatusFilter status={'Active'} onStatusChange={handleStatusChange} ></StatusFilter> 
            </div>
        </div>

        <div className='table-ctn rounded-2'>
           <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'center' }}>Customers</th>
                <th style={{ textAlign: 'center' }}>Conditions</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}> </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((row, index) => {
                const originalIndex = startIndex + index;
                return (
                  <tr
                    key={originalIndex}
                    onClick={(e) =>
                      !e.target.closest('.dropdown') && handleRowClick(originalIndex)
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ verticalAlign: 'middle' }}>{row.segmentTitle}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      {row.segmentType === 'AUTOMATED' ? 'Automated' : 'Label'}
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      {row.customerCount}
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      {formatSegmentCondition(row.segmentCondition)}
                    </td>
                    <td style={{ justifyItems: 'center', alignContent: 'center' }}>
                      <div
                        style={{
                          color:
                            row.segmentStatus.toLowerCase() === 'active'
                              ? '#065F46'
                              : '#991B1B',
                          backgroundColor:
                            row.segmentStatus.toLowerCase() === 'active'
                              ? '#D1FAE5'
                              : '#FEE2E2',
                          border: '1px solid',
                          borderColor:
                            row.segmentStatus.toLowerCase() === 'active'
                              ? '#6EE7B7'
                              : '#FCA5A5',
                          borderRadius: '0.2rem',
                          textAlign: 'center',
                          width: '6rem',
                          padding: '4px',
                        }}
                      >
                        {row.segmentStatus}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <Dropdown align="end" style={{ zIndex: 10 }}>
                        <Dropdown.Toggle
                          variant="light"
                          id="dropdown-basic"
                          className="border border-0 ms-auto"
                          style={{ marginRight: '10px' }}
                        >
                          <BsThreeDotsVertical />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEdit(originalIndex)}>
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDelete(originalIndex)}>
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

         



            <div className="data-cards rounded-4">
        {currentPageData.map((seg,index) => (
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between align-items-center'>
                 <h3 className='fs-6 fw-medium	'>{seg.segmentTitle}</h3>
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
                    backgroundColor:
                      seg.segmentStatus.toLowerCase() === 'active' ? '#d1fae5' : '#F3F4F6',
                    border: '1px solid',
                    borderColor:
                      seg.segmentStatus.toLowerCase() === 'active' ? '#6ee7b7' : '#D1D5DB',
                    borderRadius: '0.2rem',
                    textAlign: 'center',
                    color:
                      seg.segmentStatus.toLowerCase() === 'active' ? '#065f46' : '#DC2626',
                    fontWeight: '500',
                  }}
                >
                  {seg.segmentStatus.toUpperCase()}
                </div>

                </p>
            </div>

            <div className="d-flex justify-content-start align-items-center flex-wrap mt-3" style={{ gap: '0.2rem' }}>
            <p className="m-0"><strong></strong>Customers: {seg.customerCount}</p>
            <span><LuDot size={25} /></span>
            <p className="m"><strong></strong>{seg.segmentType === 'AUTOMATED' ? 'Automated' : 'Label'}</p>
            <span><LuDot size={25} /></span>
            <p className="m-0">{formatSegmentCondition(seg.segmentCondition)}</p>
          </div>


          </div>
        ))}
      </div>


        </div>


         <div className="d-flex justify-content-end mt-2">
            <Pagination>{paginationItems}</Pagination>
          </div>

    </div>
  )
}

export default SegmentsPage