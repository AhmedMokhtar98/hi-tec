import React from 'react'
import {FiDatabase} from 'react-icons/fi';
import {BiDollar} from 'react-icons/bi';
import { NavLink } from 'react-router-dom';

export default function Store() {
    return (
        <div className="NavBar_categories_li" id="categorey_container">
            <div className="Category_Nav_li"><span className="category_name"><FiDatabase className="category_icons"/>البيانات</span>
                <div className="category_dropdown_menu">
                   <div className="category_dropdown_menu_column">
                        <h3 className="category_dropdown_menu_header"> المخزن  </h3> 
                        <NavLink to="/products"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                            <div className="category_dropdown_menu_li"> المنتجات </div>
                        </NavLink>
                        <NavLink to="/out-buyings"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                            <div className="category_dropdown_menu_li"> المنتجات الخارجية </div>
                        </NavLink>
                   </div>

                    <div className="category_dropdown_menu_column">
                        <h3 className="category_dropdown_menu_header">العملاء</h3>
                        <NavLink to="/dashboard/users"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                            <div className="category_dropdown_menu_li"> العملاء </div>
                        </NavLink>
                        <NavLink to="/dashboard/garantees"  className="NavLink_a" activeClassName="Navbar_dropdown_active_li">
                            <div className="category_dropdown_menu_li"> الضامنين </div>
                        </NavLink>
                   </div> 
            </div>
            </div>
        </div>
    )
}
