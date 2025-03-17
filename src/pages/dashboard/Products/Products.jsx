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
            const data = await getAllProduct()
            setProduct(data.data)
            setFilteredData(data.data)
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
          if (filter === "Product Id") return item.id.toString().includes(value);
          if (filter === "Product Name") return item.productName.toLowerCase().includes(lowercasedValue);
          return true;
        });
      
        console.log(filtered);
        setFilteredData(filtered);
      };

  return (
    <div className='products'>
        <div className='top d-flex justify-content-between'>
            <div>
                <h4>Products</h4>
            </div>

            <div className='d-flex gap-2'>
                <ExportBtn onClick={() => exportRef.current.exportToExcel()}>

                </ExportBtn>

                {/* <ImportBtn></ImportBtn> */}

                <Link to={'/add-product'}>
                <AddBtn  
                     text={"Add"}
                ></AddBtn>
                </Link>
            </div>

        </div>

        <div className='filter-sec d-flex gap-2 align-items-center mt-2'>

            <div className='w-75'>
                <ProductFilter 
                    filterOptions={["Product Id", "Product Name"]} 
                    onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
                />
            </div>
            
            <div className='w-25'>
                <StatusFilter status={'Active'}></StatusFilter> 
            </div>
        </div>

        <div>
            <ProductsTable ref={exportRef} data={filteredData}></ProductsTable>
         
        </div>

    </div>
  )
}

export default Products