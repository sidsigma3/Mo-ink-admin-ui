import React ,{useRef} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import ProductsTable from '../../../components/table/order/Products/ProductsTable'
import "./Products.css"
import { Link, useNavigate } from 'react-router-dom'
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'
import { Pagination } from 'react-bootstrap'

const Products = () => {

  const exportRef = useRef(null);
    
  const navigate =useNavigate()


  

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
                <ProductFilter></ProductFilter>
            </div>
            
            <div className='w-25'>
                <StatusFilter status={'Active'}></StatusFilter> 
            </div>
        </div>

        <div>
            <ProductsTable ref={exportRef}></ProductsTable>
         
        </div>

    </div>
  )
}

export default Products