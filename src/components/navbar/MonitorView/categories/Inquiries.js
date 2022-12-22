import React from 'react'
import {FaUsers} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function Inquiries() {
    return (
        <div className="NavBar_categories_li" id="categorey_container">
            <div className="Category_Nav_li" id="nav_right_li"><span className="category_name"><FaUsers className="category_icons"/>الاستعلامات</span>
                <div className="category_dropdown_menu">
                   {/* <div className="category_dropdown_menu_column">
                        <h3 className="category_dropdown_menu_header">المستندات</h3>
                   </div> */}
                   <div className="category_dropdown_menu_column">
                        <h3 className="category_dropdown_menu_header">الاستعلامات</h3>
                        <NavLink to="/add-inquiry"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                                <div className="category_dropdown_menu_li">استعلام عن عميل</div>
                        </NavLink>
                        <NavLink to="/inquiries"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                                <div className="category_dropdown_menu_li">ادارة الاستعلامات</div>
                        </NavLink>
                        <NavLink to="/blacklist"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                                <div className="category_dropdown_menu_li">العملاء المحظورين</div>
                        </NavLink>
                   </div>
            </div>
            </div>
        </div>
    )
}
