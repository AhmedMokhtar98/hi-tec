import React,{useRef} from 'react'
import {CgNotes} from 'react-icons/cg';
import { NavLink } from 'react-router-dom';

export default function Books() {
    const menu = useRef()
    const handleClick = ()=>{
        menu.current.className = "dropdown_hide";
        setTimeout(() => {
        menu.current.className = "category_dropdown_menu";
        }, 100);
    }
    return (
        <div className="NavBar_categories_li" id="categorey_container">
            <div className="Category_Nav_li" ><span className="category_name"><CgNotes className="category_icons"/>الدفاتر</span>
                <div className="category_dropdown_menu" ref={menu}>
                   <div className="category_dropdown_menu_column">
                        <h3 className="category_dropdown_menu_header" >الدفاتر</h3>
                        <NavLink to="/cash-orders" activeClassName="Navbar_dropdown_active_li" className="NavLink_a" > 
                            <div className="category_dropdown_menu_li" >فواتير نقدي</div>
                        </NavLink>
                        <NavLink to="/buyings" activeClassName="Navbar_dropdown_active_li" className="NavLink_a" >
                            <div className="category_dropdown_menu_li">دفتر المشتريات</div>
                        </NavLink>
             
                        <NavLink to="/advances" activeClassName="Navbar_dropdown_active_li" className="NavLink_a" >
                            <div className="category_dropdown_menu_li">دفتر المقدمات</div>
                        </NavLink>
                        <NavLink to="/collect" activeClassName="Navbar_dropdown_active_li" className="NavLink_a" > 
                            <div className="category_dropdown_menu_li" >دفتر التحصيل</div>
                        </NavLink>
                        <NavLink to="/finance" activeClassName="Navbar_dropdown_active_li" className="NavLink_a" >
                            <div className="category_dropdown_menu_li">دفتر اليومية</div>
                        </NavLink>
                   </div>

                   <div className="category_dropdown_menu_column">
                        <h3 className="category_dropdown_menu_header">المستندات</h3>
                        <NavLink to="/qst-data" activeClassName="Navbar_dropdown_active_li" className="NavLink_a" >
                            <div className="category_dropdown_menu_li"> مستند بيع العملاء </div>
                        </NavLink>
                   </div>
            </div>
            </div>
        </div>
    )
}
