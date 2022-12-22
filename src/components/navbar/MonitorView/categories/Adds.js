import React,{useRef} from 'react'
import {AiOutlineAppstoreAdd} from 'react-icons/ai';
import { NavLink } from 'react-router-dom';

export default function Adds() {
    const menu = useRef()
    const handleClick = ()=>{
        menu.current.className = "dropdown_hide";
        setTimeout(() => {
        menu.current.className = "category_dropdown_menu";
        }, 100);
    }
    return (
        <div className="NavBar_categories_li" id="categorey_container">
            <div className="Category_Nav_li"><span className="category_name"><AiOutlineAppstoreAdd className="category_icons"/>الاضافة</span>
                <div className="category_dropdown_menu" ref={menu}>
                   <div className="category_dropdown_menu_column">
                        <h3 className="category_dropdown_menu_header">الاضافة</h3>
                        <NavLink to="/add-cash" className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                            <div className="category_dropdown_menu_li" >اضافة فواتير نقدي</div>
                        </NavLink>
                
                        <NavLink to="/add-buyings"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                            <div className="category_dropdown_menu_li">اضافة مشتريات</div>
                        </NavLink>

                        <NavLink to="/add-out-buyings"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                            <div className="category_dropdown_menu_li">اضافة منتجات خارجية</div>
                        </NavLink>
                   </div>

                   <div className="category_dropdown_menu_column">
                        <h3 className="category_dropdown_menu_header">المستندات</h3>
                        <NavLink to="/add-qst"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                            <div className="category_dropdown_menu_li" >اضافة مستند بيع</div>
                        </NavLink>
                   </div>
                 
            </div>
            </div>
        </div>
    )
}
