import {BrowserRouter,Route,Routes,Navigate} from 'react-router-dom'
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
import { OrderProvider } from './components/Context/OrderContext';
import SettingPage from './pages/dashboard/Settings/SettingPage';
import { useState,useEffect } from 'react';
import ProfilePage from './pages/dashboard/Profile/ProfilePage';
import LoginPage from './pages/dashboard/Authnticate/Login/LoginPage';
import SignupPage from './pages/dashboard/Authnticate/Signup/SignupPage';
import ForgotPassword from './pages/dashboard/Authnticate/ForgotPassword/ForgotPassword';
import VerifyCode from './pages/dashboard/Authnticate/Verify/VerifyCode';
import ResetPassword from './pages/dashboard/Authnticate/ResetPassword/ResetPassword';
import AuthPage from './pages/dashboard/Authnticate/AuthPage';
import { BulkAssignProvider } from './components/Context/BulkAssignContext';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  // Update `isAuthenticated` when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };

    // Add event listener to watch for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>

        <Routes>
             <Route path="/login" element={<LoginPage></LoginPage>} />
              <Route path='/signup' element={<SignupPage></SignupPage>}></Route>
              <Route path='/forgotPassword' element={<ForgotPassword></ForgotPassword>}></Route>
              <Route path='/verifyCode' element={<VerifyCode></VerifyCode>}></Route>
              <Route path='/resetPassword' element={<ResetPassword></ResetPassword>}></Route>
              <Route path='/' element={<AuthPage setAuthStatus={setIsAuthenticated}></AuthPage>}></Route>
            
             <Route
              path="*"
              element={
                isAuthenticated ? (
                  <ProtectedRoute>
                    <Header />
                    <div className="main d-flex">
                      <div className="sidebarWrapper">
                        <SideBar />
                      </div>
                      <div className="content w-100 p-3">
                        <OrderProvider>
                          <ProductProvider>
                            <DiscountProvider>
                              <CustomerProvider>
                                <SpinnerDyersProvider>
                                  <SegmentsProvider>
                                  <BulkAssignProvider>
                                    <Routes>
                                      <Route path="/dashboard" element={<Dashboard />} />
                                       <Route path="/orders" element={<Orders />} />            
                                      <Route path="/create-order" element={<CreateOrder />} />
                                      <Route path="/products" element={<Products />} />
                                      <Route path="/add-product" element={<AddProduct />} />
                                      <Route path="/analytics" element={<AnalyticsPage />} />
                                      <Route path="/graph-details" element={<GraphDetailsPage />} />
                                      <Route path="/discounts" element={<DiscountsPage />} />
                                      <Route path='/add-discount' element={<AddDiscountPage></AddDiscountPage>}></Route>
                                      <Route path='/customers' element={<CustomersPage></CustomersPage>}></Route>
                                      <Route path='/add-customer' element={<AddCustomerPage></AddCustomerPage>}></Route>
                                      <Route path='/spinners-and-dyers' element={<Spinners></Spinners>}></Route>
                                      <Route path='/add-spinner-and-dyers' element={<AddSpinners></AddSpinners>}></Route>
                                      <Route path='/segments' element={<SegmentsPage></SegmentsPage>}></Route>
                                      <Route path='/add-segments' element={<AddSegmentsPage></AddSegmentsPage>}></Route>
                                      <Route path='/users' element={<UserPage></UserPage>}></Route>
                                      <Route path='/add-user' element={<AddUser></AddUser>}></Route>
                                      <Route path='/settings' element={<SettingPage></SettingPage>}></Route>
                                      <Route path='/profile' element={<ProfilePage setIsAuthenticated={setIsAuthenticated}></ProfilePage>}></Route>
                                    </Routes>
                                    </BulkAssignProvider>
                                  </SegmentsProvider>
                                </SpinnerDyersProvider>
                              </CustomerProvider>
                            </DiscountProvider>
                          </ProductProvider>
                        </OrderProvider>
                      </div>
                    </div>
                    </ProtectedRoute>
                ) : (
                  <Navigate to="/" />
                )
              }
            />

        </Routes>


    
        {/* <Header></Header>
        <div className='main d-flex'>
        <div className='sidebarWrapper'>
          <SideBar></SideBar>
        </div>
        <div className='content w-100 p-3'>
          <OrderProvider>
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
              <Route path='/settings' element={<SettingPage></SettingPage>}></Route>
              <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
              <Route path='/Login' element={<LoginPage></LoginPage>}></Route>
          </Routes>
          </SegmentsProvider>
          </SpinnerDyersProvider>
        </CustomerProvider>
        </DiscountProvider>
        </ProductProvider>
        </OrderProvider>
        </div>
        </div> */}
       
    </BrowserRouter>
  );
}

export default App;
