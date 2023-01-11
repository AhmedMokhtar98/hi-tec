import React ,{useState , useEffect, useRef,useContext } from 'react'
import axios from 'axios'
import {RiArrowDropDownLine} from 'react-icons/ri';
import {BsSearch} from 'react-icons/bs';
import {HiOutlineHome} from 'react-icons/hi';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import {NavLink,useHistory,useLocation} from 'react-router-dom'
import './css/navbar.css';
import Books from './categories/Books';
import Store from './categories/Store';
import { data } from './../../../Context/Context';
import Adds from './categories/Adds';
import Inquiries from './categories/Inquiries';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


export default function NavAuth() {
let history = useHistory();
const [matches, setMatches] = useState(window.matchMedia("(min-width: 950px)").matches)
const {setLoginstatus,username} = useContext(data)
const[dropdown,SetDropdown]=useState(false);
const focusInput = useRef();

const handleClose = () => {
    SetDropdown(false);
  };

const Logout = ()=>{
    axios.get("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/logout")
        .then((response)=>{
            console.log(response.data.LoggedOut);
            setLoginstatus(false);
            localStorage.removeItem('token');
            cookies.remove('ssid');
            history.go('./login')
        });
}

useEffect(async() => {
    const handler = (e) => setMatches( e.matches );
    window.matchMedia("(min-width: 950px)").addListener(handler);
},[])

    return (
            <div className="NavStack">
                <div className="NavBar">
                    <div className="NavBar_user_info">
                        <Button variant="text" onClick={()=>SetDropdown(!dropdown)} id="Navbar_user_info_btn">
                            <div className="Navbar_username">{username}</div>
                            <div className="NavBar_dropDown_icon"><RiArrowDropDownLine className="nav_dropdown_icon"/></div>
                        </Button>
                    </div>

                    {dropdown ? 
                    <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={dropdown}
                            onClick={handleClose}
                    >
                    <div className="NavBar_dropdown_menu">
                        <Button onClick={Logout} variant="text" className="NavBar_dropdown_menu_li" id="Logout_btn" > تسجيل الخروج</Button>
                    </div>
                    </Backdrop>
                    : ''}
                    <div className="Logo_section">
                        <img src={process.env.PUBLIC_URL+'/home/5.png'} className="nav_logo_img"/>
                        <div className="NavBar_Logo" onClick={()=>history.push('/')}> هاي تك للتقسيط </div>
                    </div>
                </div> 
                    
            </div> 
    )
}
