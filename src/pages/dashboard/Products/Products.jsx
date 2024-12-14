import React from 'react'
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

    const sampleProducts = [
        {
          productId: 'PRD001',
          productName: 'Cotton Yarn',
          size: '2/60',
          colorVariants: ['#FFFFFF', '#F5F5DC', '#FF5733'], // White, Beige, Orange-Red
          stock: 50,
          price: '₹499',
          status: 'Active',
        },
        {
          productId: 'PRD002',
          productName: 'Cotton Yarn',
          size: '2/74',
          colorVariants: ['#F5F5DC', '#C70039', '#900C3F'], // Beige, Red, Deep Red
          stock: 40,
          price: '₹499',
          status: 'Active',
        },
        {
          productId: 'PRD003',
          productName: 'Silk',
          size: '2/80',
          colorVariants: ['#FFD700', '#FF4500', '#FF69B4'], // Golden, Orange-Red, Hot Pink
          stock: 30,
          price: '₹1,299',
          status: 'Active',
        },
        {
          productId: 'PRD004',
          productName: 'Silk',
          size: '2/92',
          colorVariants: ['#C0C0C0', '#808080', '#00008B'], // Silver, Gray, Dark Blue
          stock: 20,
          price: '₹1,299',
          status: 'Inactive',
        },
        {
          productId: 'PRD005',
          productName: 'Wool',
          size: '2/60',
          colorVariants: ['#000000', '#8B4513', '#A52A2A'], // Black, SaddleBrown, Brown
          stock: 25,
          price: '₹999',
          status: 'Active',
        },
        {
          productId: 'PRD006',
          productName: 'Wool',
          size: '2/80',
          colorVariants: ['#8B4513', '#A52A2A', '#5F9EA0'], // SaddleBrown, Brown, CadetBlue
          stock: 15,
          price: '₹999',
          status: 'Inactive',
        },
        {
          productId: 'PRD007',
          productName: 'Linen',
          size: '2/74',
          colorVariants: ['#EEDC82', '#FAFAD2', '#FFDEAD'], // Pale Golden, Light Yellow, NavajoWhite
          stock: 80,
          price: '₹799',
          status: 'Active',
        },
        {
          productId: 'PRD008',
          productName: 'Linen',
          size: '2/92',
          colorVariants: ['#FAFAD2', '#FFDAB9', '#FFE4E1'], // Light Yellow, Peach Puff, Misty Rose
          stock: 100,
          price: '₹799',
          status: 'Inactive',
        },
        {
          productId: 'PRD009',
          productName: 'Polyester',
          size: '2/60',
          colorVariants: ['#1E90FF', '#4682B4', '#5F9EA0'], // Dodger Blue, Steel Blue, Cadet Blue
          stock: 60,
          price: '₹399',
          status: 'Active',
        },
        {
          productId: 'PRD010',
          productName: 'Polyester',
          size: '2/80',
          colorVariants: ['#FF0000', '#DC143C', '#8B0000'], // Red, Crimson, Dark Red
          stock: 45,
          price: '₹399',
          status: 'Inactive',
        },
      ];
      

    const navigate =useNavigate()


  

  return (
    <div className='products'>
        <div className='top d-flex justify-content-between'>
            <div>
                <h4>Products</h4>
            </div>

            <div className='d-flex gap-2'>
                <ExportBtn>

                </ExportBtn>

                <ImportBtn></ImportBtn>

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
            <ProductsTable sampleProducts={sampleProducts}></ProductsTable>
         
        </div>

    </div>
  )
}

export default Products