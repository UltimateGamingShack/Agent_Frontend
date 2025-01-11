import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome_Page from './components/WelcomePage';
import Register_Agent from './components/Register_Agent';
import View_OTP from './components/View_OTP';
import Successful_Registration from './components/Successful_Registration';
import Set_Account from './components/Set_Account';
import Login_Page from './components/Login_Page';
import Login_Password from './components/Login_Password';
import Login_MPIN from './components/Login_MPIN';
import Add_Customer from './components/Add_Customer';
import TermsAndConditions from './components/TermsAndConditions';
import PolicyPage from './components/PolicyPage';
import EditCustomerPage from './components/EditCustomer';
import Agent_Home from './components/Agent_Home';
import CustomerPage from './components/CustomerPage';
import AddPolicy from './components/AddPolicy';
import EditPolicy from './components/EditPolicy';
import OtpVerificationComponent from './components/OTP_verification';

const App:React.FC=()=>{
  return(
  <>
  <BrowserRouter>
  
  <Routes>
    <Route path='/' element ={<Welcome_Page/>}></Route>
    <Route path='/register-agent' element ={<Register_Agent/>}></Route>
    <Route path='/view_otp' element ={<View_OTP/>}></Route>
    <Route path='/verify_otp' element ={<OtpVerificationComponent/>}></Route>
    <Route path='/success_page' element ={<Successful_Registration/>}></Route>
    <Route path='/set_account' element ={<Set_Account/>}></Route>
    <Route path='/login-page' element ={<Login_Page/>}></Route>
    <Route path='/login_password' element ={<Login_Password/>}></Route>
    <Route path='/login-mpin' element ={<Login_MPIN/>}></Route>
    <Route path='/add_customer' element ={<Add_Customer/>}></Route>
    <Route path='/terms-and-conditions' element ={<TermsAndConditions/>}></Route>
    <Route path='/customer-policy' element ={<PolicyPage/>}></Route>
    <Route path='/edit-customer' element ={<EditCustomerPage/>}></Route>
    <Route path='/agent_home' element ={<Agent_Home/>}></Route>

    <Route path='/display-customers' element ={<CustomerPage/>}></Route>
    <Route path='/customer-policy' element ={<PolicyPage/>}></Route>
    <Route path='/add_policy' element ={<AddPolicy/>}></Route>
    <Route path='/edit_policy' element ={<EditPolicy/>}></Route>
    </Routes>
    </BrowserRouter>
  </>
  )
}

export default App;
