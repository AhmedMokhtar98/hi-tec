import React from 'react'
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
export default function Inquiries({HoverScreen}) {
    return (
        <div className="SideMenu_ul">
            <div className="grid_">
                    <NavLink to="/add-inquiry" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">استعلام عن عميل</div></NavLink>
                    <NavLink to="/inquiries" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">ادارة الاستعلامات</div></NavLink>
                    <NavLink to="/blacklist" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">العملاء المحظورون</div></NavLink>
            </div>
        </div>
    )
}
