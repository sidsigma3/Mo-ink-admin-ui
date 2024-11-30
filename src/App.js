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
import { CustomerProvider } from './components/Context/CustomerContext';
import Spinners from './pages/dashboard/Spinner&Dyers/Spinners';
import AddSpinners from './pages/dashboard/Spinner&Dyers/AddSpinners';
import { SpinnerDyersProvider } from './components/Context/SpinnersAndDyersContext';
import SegmentsPage from './pages/dashboard/Customers/Segments/SegmentsPage';
import AddSegmentsPage from './pages/dashboard/Customers/Segments/AddSegmentsPage';
import { SegmentsProvider } from './components/Context/SegmentsContext';
import UserPage from './pages/dashboard/Users/UserPage';
import AddUser from './pages/dashboard/Users/AddUser';

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
        <CustomerProvider>
          <SpinnerDyersProvider>
            <SegmentsProvider>
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
              <Route path='/spinners-and-dyers' element={<Spinners></Spinners>}></Route>
              <Route path='/add-spinner-and-dyers' element={<AddSpinners></AddSpinners>}></Route>
              <Route path='/segments' element={<SegmentsPage></SegmentsPage>}></Route>
              <Route path='/add-segments' element={<AddSegmentsPage></AddSegmentsPage>}></Route>
              <Route path='/users' element={<UserPage></UserPage>}></Route>
              <Route path='/add-user' element={<AddUser></AddUser>}></Route>
          </Routes>
          </SegmentsProvider>
          </SpinnerDyersProvider>
        </CustomerProvider>
        </DiscountProvider>
        </ProductProvider>
        </div>
        </div>
       
    </BrowserRouter>
  );
}

export default App;
