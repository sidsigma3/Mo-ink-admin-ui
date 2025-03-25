import React, {useState , useEffect} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./DiscountPage.css"
import { Link } from 'react-router-dom'
import { useDiscounts } from '../../../components/Context/DiscountContext'
import { useNavigate } from 'react-router-dom'
import { LuDot } from "react-icons/lu";
import { Pagination } from 'react-bootstrap'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from 'react-bootstrap'
import { getAllDiscount } from '../../../services/DiscountService'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DiscountsPage = () => {

  const navigate = useNavigate ()
  

  const [discountData , setDiscountData] = useState([])
  const [filteredData, setFilteredData] = useState([]);
  
      useEffect(() => {
          const fetchData = async () => {
            try {
              const data = await getAllDiscount();
              console.log(data)
              setDiscountData(data.data)
              setFilteredData(data.data)
            } catch (error) {
              console.error('Error fetching Customers:', error);
            }
          };
        
        fetchData(); 
      }, []); 
  

  const handleRowClick = (index) => {
    navigate('/add-discount', { state: { index , discountData} });
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
    setDiscountData(discountData.filter((_, i) => i !== index));
  };

  const handleDuplicate = (index) => {
    setDiscountData([discountData[index],...discountData]);
  };


  const handleFilterChange = (filter, value) => {
    const lowercasedValue = value.toLowerCase();

    const filtered = discountData.filter((item) => {
        // if (filter === "Order Id") return item.orderId.toString().includes(value);
        if (filter === "Discount Code") return item.discountCode.toLowerCase().includes(lowercasedValue);
        return true;
    });

    setFilteredData(filtered);
    };

    const exportToExcel = (discounts) => {
      if (!discounts || !discounts.length) {
        alert("No discounts available for export.");
        return;
      }
    
      const worksheet = XLSX.utils.json_to_sheet(
        discounts.map((discount) => {
          const applicableProduct = discount?.applicableProducts[0]?.productName || "N/A";
          const discountInfo =
            discount.discountType === "Percentage"
              ? `${discount.discountValue}% off on ${applicableProduct}`
              : `₹${discount.discountValue} off on ${applicableProduct}`;
          return {
            "Title": discount.discountCode,
            "Status": discount.discountStatus,
            "Method": discount.discountMethod,
            "Eligible Customers": discount.eligibleCustomers.length,
            "Used": discount.used,
            "Discount Details": discountInfo,
            "Minimum Purchase Requirement": discount.minPurchaseRequirement || "N/A"
          };
        })
      );
    
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Discounts");
    
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(dataBlob, "Discounts_List.xlsx");
    };

  return (
    <div className='discounts'>
        <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.3rem'}}>Discounts</h4>

            <div className='d-flex gap-2'>
                <ExportBtn onClick={() => exportToExcel(filteredData)}></ExportBtn>

                <Link to={'/add-discount'}>
                <AddBtn text={"Add Discount"}></AddBtn>
                </Link>
            </div>
        </div>

        <div className='d-flex gap-2 filter-sec'>
            <div className='w-75'>
              <ProductFilter 
                  filterOptions={["Discount Code"]} 
                  onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
              />
            </div>
         
            <div className='w-25'>
                <StatusFilter status={'Active'}></StatusFilter> 
            </div>
        </div>


        <div className='discount-table-ctn'>
          <Table hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Method</th>
                <th>Customer</th>
                <th>Used</th>
                <th style={{width:'1rem'}}></th>
              </tr>
            </thead>

            <tbody>
            {filteredData.map((discount, index) => (
            <tr key={index} onClick={(e) => !e.target.closest('.dropdown') && handleRowClick(index)} style={{ cursor: "pointer" }}>
              <td>
                <div>
                <h5>{discount.discountCode}</h5>
                <div className='d-flex gap-3 align-itmes-cenetr'>
                <p className="text-muted m-0">
                  {discount.discountType === "Percentage"
                    ? `${discount.discountValue}% off on ${discount?.applicableProducts[0]?.productName}`
                    : `₹${discount.discountValue} off on cotton yarn`}
                </p>
               
                <p className='text-muted m-0'>{discount.minPurchaseRequirement}</p>
                </div>
                </div>
                
                </td>
                <td>
                 {new Intl.DateTimeFormat('en-GB').format(new Date(discount.startDateTime))}
                </td>
              <td>
                <div style={{backgroundColor:discount.discountStatus.toLowerCase() === 'active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:discount.discountStatus.toLowerCase()==='active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'4rem'}}>
                {discount.discountStatus}
                </div>
              </td>
              <td>{discount.discountMethod}</td>
              <td style={{textTransform:'capitalize'}}>{discount.eligibleCustomers.length}</td>
              <td>{discount.used}</td>
              <td>
                    <Dropdown>
                        <Dropdown.Toggle as="div" variant="light" id="dropdown-basic" className='border border-0'>
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
        {filteredData.map((discount,index) => (
          <div className="data-card shadow-sm" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{discount.discountCode}</h3>
                 <p> 
                 <div style={{backgroundColor:discount.discountStatus.toLowerCase() === 'active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:discount.discountStatus.toLowerCase()==='active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'4rem'}}>
                  {discount.discountStatus}
                </div>
                </p>
            </div>

            <div className='d-flex mt-3'>
            
            <p className="text-muted m-0">
                  {discount.discountType === "Percentage"
                    ? `${discount.discountValue}% off on ${discount?.applicableProducts[0]?.productName}`
                    : `₹${discount.discountValue} off on cotton yarn`}
              </p>

            <span><LuDot  size={25}/></span>

            <p><strong></strong> {discount.minPurchaseRequirement}</p>

            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
           
            <div style={{ display: 'flex' }}>
                {product.colorVariants.map((color, index) => (
                <div
                    key={index}
                    style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    marginLeft: index === 0 ? '0' : '-10px',
                    border: '1px solid #fff',
                    }}
                 
                ></div>
                ))}
            </div>
            </div> */}
            </div>

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

export default DiscountsPage