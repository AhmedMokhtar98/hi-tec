import React from 'react'
import { NavLink } from 'react-router-dom';

export default function Books({HoverScreen}) {
    return (
        <div className="SideMenu_ul">
            <div className="grid_">
                    <NavLink to="/cash-orders" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">فواتير نقدي</div></NavLink>
                    <NavLink to="/buyings" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">دفتر المشتريات</div></NavLink>
                    <NavLink to="/advances" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">دفتر المقدمات</div></NavLink>
                    <NavLink to="/collect" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">دفتر التحصيل</div></NavLink>
                    <NavLink to="/finance" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">دفتر اليومية</div></NavLink>
                    <NavLink to="/qst-data" activeClassName="active_side" style={{borderTop:'solid 2px rgb(167 180 255)',color:'rgb(63 81 181)'}} className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">مستند بيع عملاء</div></NavLink>
            </div>
        </div>
    )
}
