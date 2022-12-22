import React,{useState} from 'react'
import {CgNotes} from 'react-icons/cg';
import {HiOutlineHome} from 'react-icons/hi';
import {FaUsers} from 'react-icons/fa';
import {BsAdd} from 'react-icons/bs'
import {FiDatabase} from 'react-icons/fi';
import { BsHeart } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import './css/BotomNav.css'
import './css/SideMenu.css'
import Books from './Sides/Books';
import Store from './Sides/Store';
import Adds from './Sides/Adds';
import {BsPlusCircle} from 'react-icons/bs';
import Inquiries from './Sides/Inquiries';
import { useHistory } from 'react-router-dom';



export default function BottomNav() {
const[Menu,setMenu]=useState({Home:false,Books:false,Add:false,Store:false,Clients:false})
const[hover,setHover]=useState(false)
const history = useHistory()
const HoverScreen = ()=>{
    Object.keys(Menu).forEach(v => Menu[v] = false)
    setHover(false)
}

    return (
        <div>
            <div className="BottomNav">
                <div className="BottomNav_li" onClick={()=>{ history.push('/');setHover(false)}}>
                    <div className="BottomNav_li_icon"><HiOutlineHome/></div>
                    <div className="BottomNav_li_label">الرئيسية</div>
                </div>
                <div className="BottomNav_li" onClick={()=>{setMenu({...Menu, Books:!Menu.Books}); setHover(true)}}>
                    <div className="BottomNav_li_icon"><CgNotes/></div>
                    <div className="BottomNav_li_label">الدفاتر</div>
                </div>
                <div className="BottomNav_li" onClick={()=>{setMenu({...Menu, Add:!Menu.Add}); setHover(true)}}>
                    <div className="BottomNav_li_icon"><BsPlusCircle className="category_icons" id="plus_circle"/></div>
                    <div className="BottomNav_li_label">الاضافة</div>
                </div>
                <div className="BottomNav_li" onClick={()=>{setMenu({...Menu, Store:!Menu.Store}); setHover(true)}}>
                    <div className="BottomNav_li_icon"><FiDatabase/></div>
                    <div className="BottomNav_li_label">البيانات</div>
                </div>
                <div className="BottomNav_li" onClick={()=>{setMenu({...Menu, Clients:!Menu.Clients}); setHover(true)}}>
                    <div className="BottomNav_li_icon"><FaUsers/></div>
                    <div className="BottomNav_li_label">الاستعلام</div>
                </div>
            
            </div>

            <div className="hover_screen" style={{display:`${hover?"block":"none" }`}} onClick={HoverScreen}></div>

            <div className={`${Object.keys(Menu).some(k => Menu[k])?"SideMenu showMenu":"SideMenu"}`} >
                    {/*---------------Menu Head------------------*/}
                    <div onClick={HoverScreen} className="SideMenu_Header">
                        <AiOutlineClose id="CloseIcon"/>
                        <div className="menu_name">{Menu.Books?<>الدفاتر</>:''}</div>   
                        <div className="menu_name">{Menu.Add?<>الاضافة</>:''}</div>   
                        <div className="menu_name">{Menu.Store?<>المخزن</>:''}</div>   
                        <div className="menu_name">{Menu.Clients?<>العملاء</>:''}</div>   
                    </div>
                    {/*---------------Menu content------------------*/}
                    {Menu.Books?<Books HoverScreen={HoverScreen}/>:''}
                    {Menu.Add?<Adds HoverScreen={HoverScreen}/>:''}
                    {Menu.Store?<Store HoverScreen={HoverScreen}/>:''}
                    {Menu.Clients?<Inquiries HoverScreen={HoverScreen}/>:''}
            </div>
        </div>
    )
}
