import React ,{useRef,useState,useEffect} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import ProductsTable from '../../../components/table/order/Products/ProductsTable'
import "./Products.css"
import { Link, useNavigate } from 'react-router-dom'
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'
import { Pagination } from 'react-bootstrap'
import { getAllProduct } from '../../../services/ProductService'

const Products = () => {

  const exportRef = useRef(null);
    
  const navigate =useNavigate()

  const [product,setProduct] = useState([])
  const [filteredData, setFilteredData] = useState([]); 

   useEffect(() => {
          fetchProductdData();
    }, []);


    const fetchProductdData = async () => {
        try {
            const data = await getAllProduct();
            setProduct(data.data);
            setFilteredData(data.data); // Default filter
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };


    const handleFilterChange = (filter, value) => {
        const lowercasedValue = value.toLowerCase().trim();
      
        if (!lowercasedValue) {
          setFilteredData(product);
          return;
        }
      
        const filtered = product.filter((item) => {
          if (filter === "Product Name") return item.productName.toLowerCase().includes(lowercasedValue);
          return true;
        });
      
        console.log(filtered);
        setFilteredData(filtered);
      };


      const handleStatusChange = (status) => {
    if (status === "All" || !status) {
        setFilteredData(product);
        return;
    }
    
    const filtered = product.filter(item => {
        // Check multiple possible status field names
        const statusFields = [
            item.availableStatus,
            item.status,
            item.productStatus,
            item.available_status
        ];
        
        return statusFields.some(field => 
            field?.toString().toLowerCase() === status.toLowerCase()
        );
    });
    
    setFilteredData(filtered);
};

  return (
    <div className='products'>
    <div className='top d-flex align-items-center justify-content-between mt-3 mb-4 gap-3'> <div>
                <h3 className='mb-0 ' style={{fontSize:'1.2rem'}}>Products</h3>
            </div>

            <div className='d-flex gap-2'>
                <ExportBtn onClick={() => exportRef.current.exportToExcel()}>

                </ExportBtn>

                {/* <ImportBtn></ImportBtn> */}

                <Link to={'/add-product'}>
                <AddBtn  
                     text={"Add Product"}
                ></AddBtn>
                </Link>
            </div>

        </div>

        <div className='order-filter-cttn d-flex gap-2 mb-2 mt-3 '>
                                            <div className='col-sm-6 col-md-9'>
                                                <ProductFilter  
                    filterOptions={["Product Name"]} 
                    onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
                />
            </div>
            
            <div className='col-sm-6 col-md-3'>
            <StatusFilter status="All" onStatusChange={handleStatusChange} />
            </div>
        </div>

        <div>
            <ProductsTable ref={exportRef} data={filteredData}></ProductsTable>
         
        </div>

    </div>
  )
}

export default Products