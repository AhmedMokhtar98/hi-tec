import React,{useState,useContext} from 'react'
import axios from 'axios'
import {MdOutlineAttachMoney} from 'react-icons/md';
import {FaUsers} from 'react-icons/fa';
import {BsSearch} from 'react-icons/bs'
import {FaStore} from 'react-icons/fa';
import { BsHeart } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import {AiOutlineMenu} from 'react-icons/ai'
import {BiLogOutCircle} from 'react-icons/bi'
import {RiAddLine,RiAdminLine} from 'react-icons/ri';
import Books from './../../components/navbar/MobileView/Sides/Books';
import Store from './../../components/navbar/MobileView/Sides/Store';
import './css/header_menu.css';
import Adds from './../../components/navbar/MobileView/Sides/Adds';
import Inquiries from './../../components/navbar/MobileView/Sides/Inquiries';
import { useHistory } from 'react-router-dom';
import { data } from './../../Context/Context';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default function HeaderMenu() {
const history = useHistory()
const {setLoginstatus,username} = useContext(data)
const[Menu,setMenu]=useState({Books:false,Search:false,Store:false,Clients:false})
const[hover,setHover]=useState(false)
const[headerDropDown,setHeaderDropDown]=useState(false)

const HoverScreen = ()=>{
    Object.keys(Menu).forEach(v => Menu[v] = false)
    setHover(false)
    setHeaderDropDown(false)
}
const Logout = ()=>{
    axios.get("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/logout-2")
        .then((response)=>{
            console.log(response.data.LoggedOut);
            setLoginstatus(false);
            localStorage.removeItem('token');
            cookies.remove('ssid');
            history.go('./login')
        });
}


    return (
        <div className="Header_Menu_container">
        <AiOutlineMenu onClick={()=>{setHeaderDropDown(!headerDropDown);setHover(!hover)}} className="Header_Menu_icon"/>
            <div className={headerDropDown ? 'Header_Menu_dropdown Header_Menu_dropdown_enable' : 'Header_Menu_dropdown '}>
              <div className={headerDropDown ? 'HeaderMenu Header_Menu_enable' : 'HeaderMenu '}>
                <div className="HeaderMenu_li" onClick={()=>{history.push('/dashboard/end-day')}}>
                    <div className="HeaderMenu_li_icon"><RiAdminLine className={headerDropDown ? 'HeaderMenu_icon HeaderMenu_icon_enable' : 'HeaderMenu_icon '}/></div>
                    <div className="HeaderMenu_li_label">لوحة التحكم</div>
                </div>
                <div className="HeaderMenu_li" onClick={Logout}>
                    <div className="HeaderMenu_li_icon"><BiLogOutCircle className={headerDropDown ? 'HeaderMenu_icon HeaderMenu_icon_enable' : 'HeaderMenu_icon '} style={{color:'red',fontSize:'20px',padding:'17px',boxShadow:'0px 0px 8px #ff1100'}}/></div>
                    <div className="HeaderMenu_li_label" style={{background:'#ffe8e8',color:'red'}}>تسجيل الخروج</div>
                </div>
                {/* <div className="HeaderMenu_li" onClick={()=>{setMenu({...Menu, Books:!Menu.Books}); setHover(true)}}>
                    <div className="HeaderMenu_li_icon"><MdOutlineAttachMoney className={headerDropDown ? 'HeaderMenu_icon HeaderMenu_icon_enable' : 'HeaderMenu_icon '}/></div>
                    <div className="HeaderMenu_li_label">المبيعات</div>
                </div>
                <div className="HeaderMenu_li" onClick={()=>{setMenu({...Menu, Search:!Menu.Search}); setHover(true)}}>
                    <div className="HeaderMenu_li_icon"><RiAddLine className={headerDropDown ? 'HeaderMenu_icon HeaderMenu_icon_enable' : 'HeaderMenu_icon '}/></div>
                    <div className="HeaderMenu_li_label">الاضافة</div>
                </div>
                <div className="HeaderMenu_li" onClick={()=>{setMenu({...Menu, Store:!Menu.Store}); setHover(true)}}>
                    <div className="HeaderMenu_li_icon"><FaStore className={headerDropDown ? 'HeaderMenu_icon HeaderMenu_icon_enable' : 'HeaderMenu_icon '}/></div>
                    <div className="HeaderMenu_li_label">المخزن</div>
                </div>
                <div className="HeaderMenu_li" onClick={()=>{setMenu({...Menu, Clients:!Menu.Clients}); setHover(true)}}>
                    <div className="HeaderMenu_li_icon"><FaUsers className={headerDropDown ? 'HeaderMenu_icon HeaderMenu_icon_enable' : 'HeaderMenu_icon '}/></div>
                    <div className="HeaderMenu_li_label">العملاء</div>
                </div> */}
            </div>

            <div className="Header_Menu_dropdown_hover_screen" style={{display:`${hover?"block":"none" }`}} onClick={HoverScreen}></div>

            <div className={`${Object.keys(Menu).some(k => Menu[k])?"SideMenu showMenu":"SideMenu"}`} >
                    {/*---------------Menu Head------------------*/}
                    <div onClick={HoverScreen} className="SideMenu_Header">
                        <AiOutlineClose id="CloseIcon"/>
                        <div className="menu_name">{Menu.Books?<>المبيعات</>:''}</div>   
                        <div className="menu_name">{Menu.Search?<>الاضافة</>:''}</div>   
                        <div className="menu_name">{Menu.Store?<>المخزن</>:''}</div>   
                        <div className="menu_name">{Menu.Clients?<>العملاء</>:''}</div>   
                    </div>
                    {/*---------------Menu content------------------*/}
                    {Menu.Books?<Books HoverScreen={HoverScreen}/>:''}
                    {Menu.Search?<Adds/>:''}
                    {Menu.Store?<Store/>:''}
                    {Menu.Clients?<Inquiries/>:''}
            </div>
          </div>
        </div>
    )
}
