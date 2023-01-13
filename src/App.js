import React,{useState,useEffect,useContext} from 'react';
import {Switch, Route} from 'react-router-dom';
import './App.css';
import jwt_decode from "jwt-decode";

import {data} from './Context/Context';
import Login from './Auth/Login/Login';
import Collect from './pages/Collect/Collect';
import PrivateRoute from './Auth/PrivateRoute/PrivateRoute';
import Nav from './components/navbar/MonitorView/Nav';
import NotFound from './pages/Collect/NotFound';
import BottomNav from './components/navbar/MobileView/BottomNav';
import CashOrders from './pages/Sales/Cash/view/CashOrders';
import CashOrderInfo from './pages/Sales/Cash/view/CashOrderInfo';
import AddCashOrder from './pages/Sales/Cash/add/Add_Cash_Order';
import AddQSTOrders from './pages/Sales/Qst/Add_QST_Orders';
import Add_inquiry from './pages/Clients/Inquiry/Add_inquiry';
import Inquires from './pages/Clients/Inquiry/Inquires';
import Inquiry_Info from './pages/Clients/Inquiry/Inquiry_Info';
import QstData from './pages/Sales/Qst/QstData';
import QstLoop from './pages/Sales/Qst/QstLoop';
import Advances from './pages/advances/Advances';
import Buyings from './pages/Store/Buyings/Buyings';
import AddBuyings from './pages/Store/Buyings/AddBuyings';
import Finance from './pages/Finance/Finance';
import Products from './pages/Store/products/Products';
import Test from './Test';
import EndDay from './admin/adminPanel/pages/EndDay';
import Users from './admin/adminPanel/pages/Users';
import AdminPanelNavigation from './admin/adminPanel/navigation/AdminPanelNavigation';
import ProductsStics from './admin/adminPanel/pages/Products';
import Garantees from './admin/adminPanel/pages/Garantees';
import Home from './pages/Home/Home';
import AddProducts from './admin/adminPanel/pages/add_files/AddProducts';
import AddClients from './admin/adminPanel/pages/add_files/AddClients';
import AddGarantees from './admin/adminPanel/pages/add_files/AddGarantees';
import PasswordChange from './admin/adminPanel/pages/account_settings/PasswordChange';
import Blacklist from './pages/Clients/Inquiry/Blacklist';
import Transfers from './admin/adminPanel/pages/Transfers';
import SentOrders from './admin/adminPanel/pages/SentOrders';
import RecievedOrders from './admin/adminPanel/pages/RecievedOrders';
import Issues from './admin/adminPanel/pages/Issues';
import Report from './pages/Clients/Inquiry/Report';
import OutBuyings from './pages/Store/OutBuyings/OutBuyings';
import AddOutBuyings from './pages/Store/OutBuyings/AddOutBuyings';
import UserProfile from './admin/adminPanel/pages/UserProfile';
import NavAuth from './components/navbar/MonitorView/NavAuth';
import RateClients_EndedQsts from './admin/adminPanel/pages/RateClients_EndedQsts';
import Rate from './admin/adminPanel/pages/Rate';

function App() {
  const [matches, setMatches] = useState(window.matchMedia("(min-width: 950px)").matches)
  const {navHidden} = useContext(data)
  
  useEffect(() => {
      const handler = (e) => setMatches( e.matches );
      window.matchMedia("(min-width: 950px)").addListener(handler);
  },[])
  return (
    <div>
          <Switch>
                <Route exact path="/login" component={Login}/>
                {localStorage.getItem('token') && jwt_decode(localStorage.getItem('token')).authority === 'marketing' ?
                <>
                 <NavAuth/>
                 <Route exact path={`/products`} ><Products /></Route> 
                </>
                : ''}

                {localStorage.getItem('token') && jwt_decode(localStorage.getItem('token')).authority === 'collect' ?
                <>
                 <NavAuth/>
                 <Route exact path={`/qst-data`} ><QstData /></Route> 
                 <Route exact path={`/qst-loop/:code`} ><QstLoop /></Route>
                </>
                : ''}
                    <Route  path="/dashboard" render={({ match: { url } }) => (<>
                      <AdminPanelNavigation />
                      <PrivateRoute exact path={`${url}/end-day`} component={EndDay}/>
                      <PrivateRoute exact path={`${url}/users`} component={Users}/>
                      <PrivateRoute exact path={`${url}/users/:nat_id`} component={UserProfile}/>
                      <PrivateRoute exact path={`${url}/garantees`} component={Garantees}/>
                      <PrivateRoute exact path={`${url}/products`} component={ProductsStics}/>
                      <PrivateRoute exact path={`${url}/ended-qsts`} component={RateClients_EndedQsts}/>
                      <PrivateRoute exact path={`${url}/ended-qsts/rate-users/:code`} component={Rate}/>
                      <PrivateRoute exact path={`${url}/order-transfers`} component={Transfers}/>
                      <PrivateRoute exact path={`${url}/sent-orders`} component={SentOrders}/>
                      <PrivateRoute exact path={`${url}/recieved-orders`} component={RecievedOrders}/>
                      <PrivateRoute exact path={`${url}/add-products`} component={AddProducts}/>
                      <PrivateRoute exact path={`${url}/add-clients`} component={AddClients}/>
                      <PrivateRoute exact path={`${url}/add-garantees`} component={AddGarantees}/>
                      <PrivateRoute exact path={`${url}/password-change`} component={PasswordChange}/>
                      <PrivateRoute exact path={`${url}/issues`} component={Issues}/>
                  </>)}/>
            <>
                <PrivateRoute>
                {matches && 
                  <Nav/> 
                }
                {!matches && 
                  <>
                    <BottomNav/>
                  </>
                }
                  <PrivateRoute exact path={`/`} ><Home /></PrivateRoute>
                  <PrivateRoute exact path={`/collect`} ><Collect /></PrivateRoute>
                  <PrivateRoute exact path={`/add-cash`} ><AddCashOrder /></PrivateRoute>
                  <PrivateRoute exact path={`/add-qst`} ><AddQSTOrders /></PrivateRoute>
                  <PrivateRoute exact path={`/add-inquiry`} ><Add_inquiry /></PrivateRoute>
                  <PrivateRoute exact path={`/inquiries`} ><Inquires /></PrivateRoute>
                  <PrivateRoute exact path={`/inquiries/:nat_id`} ><Inquiry_Info/></PrivateRoute>
                  <PrivateRoute exact path={`/inquiries/report/:nat_id`} ><Report/></PrivateRoute>
                  <PrivateRoute exact path={`/blacklist`} ><Blacklist /></PrivateRoute>
                  <PrivateRoute exact path={`/cash-orders`} ><CashOrders /></PrivateRoute>
                  <PrivateRoute exact path={`/cash-orders/:code`} ><CashOrderInfo /></PrivateRoute>
                  <PrivateRoute exact path={`/advances`} ><Advances /></PrivateRoute>
                  <PrivateRoute exact path={`/buyings`} ><Buyings /></PrivateRoute>
                  <PrivateRoute exact path={`/add-buyings`} ><AddBuyings /></PrivateRoute>
                  <PrivateRoute exact path={`/out-buyings`} ><OutBuyings /></PrivateRoute>
                  <PrivateRoute exact path={`/add-out-buyings`} ><AddOutBuyings /></PrivateRoute>
                  <PrivateRoute exact path={`/finance`} ><Finance /></PrivateRoute>
                  <PrivateRoute exact path='/test' ><Test/></PrivateRoute>
                  {localStorage.getItem('token') && (jwt_decode(localStorage.getItem('token')).authority != 'marketing')  ? <PrivateRoute exact path={`/products`} ><Products /></PrivateRoute> : ''}
                  {localStorage.getItem('token') && (jwt_decode(localStorage.getItem('token')).authority != 'collect')  ? <PrivateRoute exact path={`/qst-data`} ><QstData /></PrivateRoute> : ''}
                  {localStorage.getItem('token') && (jwt_decode(localStorage.getItem('token')).authority != 'collect')  ? <PrivateRoute exact path={`/qst-loop/:code`} ><QstLoop /></PrivateRoute> : ''}
               
                </PrivateRoute>
                {/* <Route exact path="/:category/:prefix-:suffix/:product_name/:id"  render={ (props)=> <Product {...props}  /> }></Route>   */}
            </>
          </Switch>
    </div>
  );
}

export default App;
