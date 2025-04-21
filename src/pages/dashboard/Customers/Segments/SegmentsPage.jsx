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
import "./SegmentsPage.css"
import { getAllSegment } from '../../../../services/SegmentService'

const SegmentsPage = () => {

    const navigate = useNavigate ()
   
    const { rows, setRows } = useSegments();

    const [segments,setSegments] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Active');
    const [filterText, setFilterText] = useState('');
    
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
      

      let active = 2;
        let items = [];
        for (let number = 1; number <= 5; number++) {
            items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>,
            );
        }

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
      

  return (
    <div className='segments-page'>
         <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.2rem'}}>Segments</h4>

            <div className='d-flex gap-2'>
                <ExportBtn></ExportBtn>

               

                <Link to={'/add-segments'}>
                <AddBtn text={"Add New"}></AddBtn>
                </Link>
            </div>

        </div>

        <div className='d-flex gap-2 filter-sec'>
            <div className='w-75'>
            <ProductFilter 
                  filterOptions={["Title"]} 
                  onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
              />
            </div>
         
            <div className='w-25'>
                <StatusFilter status={'Active'} onStatusChange={handleStatusChange} ></StatusFilter> 
            </div>
        </div>

        <div className='table-ctn'>
            <Table>
                <thead>
                <tr>
                     <th>Title</th>
                     <th style={{ textAlign: 'center' }}>Type</th>
                     <th style={{ textAlign: 'center' }}>Customers</th>
                     <th style={{ textAlign: 'center' }}>Conditions</th>
                     <th style={{ textAlign: 'center' }}>Status</th>
                     <th style={{ textAlign: 'center'}}> </th> {/* Actions column, e.g., Edit/Delete */}
                </tr>
                </thead>
                <tbody>
                {filteredData.map((row, index) => (
                    <tr key={index} onClick={(e) => !e.target.closest('.dropdown') && handleRowClick(index)} style={{ cursor: "pointer" }}>
                    <td style={{ verticalAlign: 'middle'}} >{row.segmentTitle}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{row.segmentType === 'AUTOMATED' ? 'Automated' : 'Label'}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{row.customerCount}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{formatSegmentCondition(row.segmentCondition)}</td>
                    <td style={{ justifyItems: 'center', alignContent:'center'}}  >
                    <div style={{color: row.segmentStatus.toLowerCase() === 'Active' ? '#065F46' : '#991B1B', backgroundColor: row.segmentStatus.toLowerCase() === 'Active' ? '#D1FAE5' : '#FEE2E2', border: '1px solid', borderColor: row.segmentStatus.toLowerCase() === 'Active' ? '#6EE7B7' : '#FCA5A5', borderRadius: '0.2rem', textAlign:'center',width:'6rem' ,padding: '4px',}}>
                      {row.segmentStatus}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    
                        <Dropdown align="end" style={{ zIndex: 10 }}>
                        <Dropdown.Toggle variant="light" id="dropdown-basic" className='border border-0 ms-auto' style={{ marginRight: '10px'}}>
                        <BsThreeDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEdit(index)}>Edit</Dropdown.Item>
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
        {filteredData.map((seg,index) => (
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{seg.segmentTitle}</h3>
                 {/* <p> 
                    <div
                     style={{
                        width:'100%',
                        padding:'0.2rem 0.4rem',
                        border:'1px solid',borderRadius:'0.2rem',textAlign:'center',
                        backgroundColor:seg.tag === 'Spinner' ? '#DBEAFE' : '#FEF3C7',
                        borderColor:seg.tag === 'Spinner' ? '#93C5FD' : '#FCD34D' ,
                        color : seg.tag === 'Spinner' ? '#1E40AF' : '#92400E' ,
                    }}
                    >
                    {seg.tag}
                    </div>
                </p> */}
            </div>

            <p><strong></strong>Customers : {seg.customerCount}</p>
    

            <p className='fw-medium'><strong></strong> {seg.segmentType === 'AUTOMATED' ? 'Automated' : 'Label'}</p>

            <p >{formatSegmentCondition(seg.segmentCondition)}</p>

          </div>
        ))}
      </div>


        </div>




    </div>
  )
}

export default SegmentsPage