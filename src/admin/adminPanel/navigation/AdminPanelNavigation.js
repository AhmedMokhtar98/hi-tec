import React, { useState,useContext,useEffect } from 'react'
import jwt_decode from "jwt-decode";
import axios from 'axios'
import Cookies from 'universal-cookie';
import { NavLink ,useHistory} from 'react-router-dom'
import {IoSettingsOutline} from 'react-icons/io5'
import {IoMdStats} from 'react-icons/io'
import {BiTransfer} from 'react-icons/bi'
import {AiOutlineUser,AiOutlineArrowDown,AiOutlineArrowUp} from 'react-icons/ai'
import {BiArrowBack,BiLockAlt} from 'react-icons/bi'
import {FiUsers,FiDatabase,FiLogOut} from 'react-icons/fi'
import {BsBoxSeam} from 'react-icons/bs'
import {RiArrowDropDownLine} from 'react-icons/ri'
import {GiHamburgerMenu} from 'react-icons/gi'
import {GrClose} from 'react-icons/gr'
import {VscLaw,VscAdd} from 'react-icons/vsc'
import {FcAddDatabase} from 'react-icons/fc'

import './Navigation.css'
import '../css/end_day.css'
import '../css/cards.css'
import GoBack from './../../../pages/components/Back';
import { data } from './../../../Context/Context';
const cookies = new Cookies();

export default function AdminPanelNavigation() {
const history = useHistory()
const {setLoginstatus,username} = useContext(data)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const[branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const[L1_dropdownStatus,setL1_DropdownStatus] = useState(true)
const[L2_dropdownStatus,setL2_DropdownStatus] = useState(true)
const[L3_dropdownStatus,setL3_DropdownStatus] = useState(true)
const[L4_dropdownStatus,setL4_DropdownStatus] = useState(false)
const[L5_dropdownStatus,setL5_DropdownStatus] = useState(false)
const[settings_menu_status,setSettingsMenu] = useState(false)
const[Show_Menu,setShowMenu] = useState(false)
const[Transfers_count_recieved,setTransfersCountR] = useState(null)
const[Transfers_count_sent,setTransfersCountS] = useState(null)

const L1_dropdown = ()=>{ setL1_DropdownStatus(!L1_dropdownStatus); }
const L2_dropdown = ()=>{ setL2_DropdownStatus(!L2_dropdownStatus) }
const L3_dropdown = ()=>{ setL3_DropdownStatus(!L3_dropdownStatus) }
const L4_dropdown = ()=>{ setL4_DropdownStatus(!L4_dropdownStatus) }
const L5_dropdown = ()=>{ setL5_DropdownStatus(!L5_dropdownStatus) }
const settings_menu = ()=>{ setSettingsMenu(!settings_menu_status) }
const [matches, setMatches] = useState(window.matchMedia("(min-width: 1075px)").matches)
useEffect(() => {
    const handler = (e) => setMatches( e.matches );
    window.matchMedia("(min-width: 1075px)").addListener(handler);
},[])

const Logout = ()=>{
    axios.get("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/logout")
        .then((response)=>{
            setLoginstatus(false);
            localStorage.removeItem('token');
            cookies.remove('ssid');
            history.push('/')
        });
}
useEffect(() => {
    const data = {branch:branchname, auth:auth}
    axios.post("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/recieved-transfer-count",data)
    .then((response)=>{
        console.log(response.data[0].count);
        setTransfersCountR(response.data[0].count)
    });


},[])

useEffect(() => {
    const data = {branch:branchname}
    axios.post("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/sent-transfer-count",data)
    .then((response)=>{
        console.log(response.data[0].count);
        setTransfersCountS(response.data[0].count)
    });
}, [])


 return (
            <>
            <div className="Top_NavBar">
                <div className="Top_nav_logo_container">
                { !Show_Menu ? !matches && <GiHamburgerMenu className="admin_panel_burger_menu_icon" onClick={()=>setShowMenu(true)}/> : <GrClose className="admin_panel_burger_menu_icon" onClick={()=>setShowMenu(false)}/>}
                    <div className="Top_nav_logo">
                     <span className="dash_board_word"> لوحة التحكم </span>
                     <span className="dash_board_branchname">{branchname != 'الكل' ? 'معرض' : ''}  {branchname === 'الكل' ? 'الادارة' : branchname} </span>
                     </div>
                    <div className="Top_nav_logo_admin_panel"></div>
                </div>
                {/* <div><IoSettingsOutline onClick={settings_menu} className={settings_menu_status ? 'gear_on' : 'gear_off'} id="Top_NavBar_settings_icon" /></div> */}
            </div>
            {/* <div  className={settings_menu_status ? 'settings_menu_show' : 'settings_menu_hide'} id="Settings_menu_right" >
                <div className="Admin_Right_Menu_li">تسجيل الخروج</div>
            </div> */}
            <BiArrowBack className="admin_arrow_back" onClick={()=>history.push('/')}/>

            <div className={Show_Menu ? "Admin_Right_MENU admin_menu_show" :  `Admin_Right_MENU ${!matches && 'admin_menu_hidden'}`}>
                <div className="Account_settings_Left_Menu">
                    <div className="Admin_Right_MENU_li">
                    <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/end-day`} activeClassName="Admin_Left_Menu_li_active"  className="Admin_Left_Menu_li"><IoMdStats/><span>التحصيل اليومي</span> </NavLink>
                    </div>

                    <div onClick={L1_dropdown} className="Admin_Left_Menu_li"> <FiDatabase/>البيانات<RiArrowDropDownLine className={L1_dropdownStatus ? 'arrow_on' : 'arrow_off'} id="arrow_icon"/></div>
                    <div className={L1_dropdownStatus ? 'L_dropdown_show' :'L_dropdown_hide'}>
                        <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/products`}  className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span>المنتجات</span>  <BsBoxSeam/></NavLink>
                        <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/users`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span>العملاء</span>  <AiOutlineUser/></NavLink>
                        <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/garantees`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span>الضامنين</span>  <FiUsers/></NavLink>
                    </div>

                    <div className="Admin_Right_MENU_li">
                        <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/ended-qsts`} activeClassName="Admin_Left_Menu_li_active"  className="Admin_Left_Menu_li"><IoMdStats/><span> التقييم</span> </NavLink>
                    </div>

                    <div onClick={L2_dropdown} className="Admin_Left_Menu_li">اضافة بيانات بلا حدود<RiArrowDropDownLine className={L2_dropdownStatus ? 'arrow_on' : 'arrow_off'} id="arrow_icon"/></div>
                    <div className={L2_dropdownStatus ? 'L_dropdown_show' :'L_dropdown_hide'}>
                         <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/add-products`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span>  اضافة منتجات    </span>  <FcAddDatabase/></NavLink>
                         <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/add-clients`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span> اضافة عملاء  </span>  <AiOutlineUser/></NavLink>
                         <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/add-garantees`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span>اضافة ضامنين  </span>  <FiUsers/></NavLink>
                    </div>

                    <div onClick={L3_dropdown} className="Admin_Left_Menu_li">التحويلات<RiArrowDropDownLine className={L3_dropdownStatus ? 'arrow_on' : 'arrow_off'} id="arrow_icon"/></div>
                    <div className={L3_dropdownStatus ? 'L_dropdown_show' :'L_dropdown_hide'}>
                        <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/order-transfers`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span>انشاء طلب تحويل</span> <BiTransfer/></NavLink>
                        <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/sent-orders`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span>طلبات التحويل الصادرة</span><span className="tranfer_count_number">{Transfers_count_sent}</span><AiOutlineArrowUp/> </NavLink>
                        <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/recieved-orders`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"> <span>طلبات التحويل الواردة </span><span className="tranfer_count_number">{Transfers_count_recieved}</span><AiOutlineArrowDown/></NavLink>
                    </div>

                    <div className="Admin_Right_MENU_li">
                    <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/issues`} activeClassName="Admin_Left_Menu_li_active"  className="Admin_Left_Menu_li"><VscLaw/><span>القضايا</span> </NavLink>
                    </div>

                    <div onClick={L5_dropdown} className="Admin_Left_Menu_li">اعدادات الحساب<RiArrowDropDownLine className={L5_dropdownStatus ? 'arrow_on' : 'arrow_off'} id="arrow_icon"/></div>
                    <div className={L5_dropdownStatus ? 'L_dropdown_show' :'L_dropdown_hide'}>
                         <NavLink  onClick={()=>setShowMenu(false)} to={`/dashboard/password-change`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active"><span>تغيير الرقم السري</span>  <BiLockAlt/></NavLink>
                         <NavLink  onClick={Logout}to={`/dashboard/add-products`} className="Admin_Left_Menu_li_dropdown" activeClassName="Admin_Left_Menu_li_dropdown_active" id="admin_panel_logout_btn"><span>تسجيل الخروج</span>  <FiLogOut/></NavLink>
                    </div>
                     
                    
                </div>
            </div>
           {Show_Menu &&  <div className="admin_backdrop_menu" onClick={()=>setShowMenu(false)}></div> }
 
  
        </>
        )
}

