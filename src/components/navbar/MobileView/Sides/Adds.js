import React,{useState} from 'react'
import TextField from '@mui/material/TextField';
import { NavLink } from 'react-router-dom';

export default function Adds({HoverScreen}) {
const[search,setSearch]=useState('');

const HandleChange = (e)=>{
    setSearch(e.target.value)
    console.log(search);
}
    return (
        <div className="SideMenu_ul">
            <div className="grid_">
                    <NavLink to="/add-cash" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">اضافة فواتير نقدي</div></NavLink>
                    <NavLink to="/add-buyings" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">اضافة مشتريات</div></NavLink>
                    <NavLink to="/add-qst" activeClassName="active_side" className="SideMenu_a" onClick={HoverScreen}><div className="SideMenu_a_li">اضافة مستند بيع</div></NavLink>
            </div>
        </div>
    )
}
