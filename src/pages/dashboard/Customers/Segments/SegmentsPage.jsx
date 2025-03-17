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
    
      useEffect(() => {
          const fetchData = async () => {
            try {
              const data = await getAllSegment();
              setSegments(data.data)
             
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
    
      const handleDuplicate = (index) => {
        setRows([rows[index],...rows]);
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
        const lowercasedValue = value.toLowerCase();
    
        const filtered = segments.filter((item) => {
            if (filter === "Order Id") return item.orderId.toString().includes(value);
            if (filter === "Customer") return item.customer.customerName.toLowerCase().includes(lowercasedValue);
            return true;
        });
    
        setFilteredData(filtered);
        };
      

  return (
    <div className='segments-page'>
         <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.3rem'}}>Segments</h4>

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
                  filterOptions={["Order Id", "Customer"]} 
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
                        <th>Title</th>
                        <th>Type</th>
                        <th>Customers</th>
                        <th>Conditions</th>
                        <th style={{width:'1rem'}}></th>
                    </tr>
                </thead>
                <tbody>
                {segments.map((row, index) => (
                    <tr key={index} onClick={(e) => !e.target.closest('.dropdown') && handleRowClick(index)} style={{ cursor: "pointer" }}>
                    <td>{row.segmentTitle}</td>
                    <td>{row.segmentType === 'AUTOMATED' ? 'Automated' : 'Label'}</td>
                    <td>{row.customerCount}</td>
                    <td>{formatSegmentCondition(row.segmentCondition)}</td>
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
        {rows.map((seg,index) => (
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{seg.title}</h3>
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

            <p><strong></strong>Customers : {seg.customers}</p>
    

            <p className='fw-medium'><strong></strong> {seg.type === 'Conditional' ? 'Automated' : 'Label'}</p>

            <p >{formatConditions(seg.conditions, seg.customerList)}</p>

          </div>
        ))}
      </div>


        </div>




    </div>
  )
}

export default SegmentsPage