import React from 'react'
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

export default function Store({HoverScreen}) {
    return (
        <div className="SideMenu_ul">
            <div className="grid_">
                    <NavLink to="/products" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">المنتجات </div></NavLink>
                    <NavLink to="/dashboard/users" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">العملاء</div></NavLink>
                    <NavLink to="/dashboard/garantees" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">الضامنين</div></NavLink>
            </div>
        </div>
    )
}
