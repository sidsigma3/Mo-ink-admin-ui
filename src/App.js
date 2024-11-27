import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Header from './components/headers/Header';
import "bootstrap/dist/css/bootstrap.min.css"
import SideBar from './components/SideBar/SideBar';
import Orders from './pages/dashboard/Orders/Orders';
import CreateOrder from './pages/dashboard/Orders/CreateOrder';
import Products from './pages/dashboard/Products/Products';
import AddProduct from './pages/dashboard/Products/AddProduct';

import { ProductProvider } from './components/Context/ProductContext';
import AnalyticsPage from './pages/dashboard/Analytics/AnalyticsPage';
import GraphDetailsPage from './components/Analylitcs/Graph/GraphDetailPage/GraphDetailsPage';
import DiscountsPage from './pages/dashboard/Discount/DiscountsPage';
import AddDiscountPage from './pages/dashboard/Discount/AddDiscountPage';
import { DiscountProvider } from './components/Context/DiscountContext';
import CustomersPage from './pages/dashboard/Customers/CustomersPage';
import AddCustomerPage from './pages/dashboard/Customers/AddCustomerPage';

function App() {
  return (
    <BrowserRouter>
        <Header></Header>
        <div className='main d-flex'>
        <div className='sidebarWrapper'>
          <SideBar></SideBar>
        </div>
        <div className='content w-100 p-3'>
        <ProductProvider>
        <DiscountProvider>
          <Routes>
              <Route path='/' element={<Dashboard></Dashboard>}></Route>
              <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
              <Route path='/orders' element={<Orders></Orders>}></Route>
              <Route path='/create-order' element={<CreateOrder></CreateOrder>}></Route>
              <Route path='/products' element={<Products></Products>}></Route>
              <Route path='/add-product' element={<AddProduct></AddProduct>}></Route>
              <Route path='/analytics' element={<AnalyticsPage></AnalyticsPage>}></Route>
              <Route path='/graph-details' element={<GraphDetailsPage></GraphDetailsPage>}></Route>
              <Route path='/discounts' element={<DiscountsPage></DiscountsPage>}></Route>
              <Route path='/add-discount' element={<AddDiscountPage></AddDiscountPage>}></Route>
              <Route path='/customers' element={<CustomersPage></CustomersPage>}></Route>
              <Route path='/add-customer' element={<AddCustomerPage></AddCustomerPage>}></Route>
          </Routes>
        </DiscountProvider>
        </ProductProvider>
        </div>
        </div>
       
    </BrowserRouter>
  );
}

export default App;
