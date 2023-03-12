import React ,{useState , useEffect, useRef,useContext } from 'react'
import axios from 'axios'
import {RiArrowDropDownLine} from 'react-icons/ri';
import {BsSearch} from 'react-icons/bs';
import {HiOutlineHome} from 'react-icons/hi';
import {MdOutlineNotificationsNone} from 'react-icons/md';
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

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import jwt_decode from "jwt-decode";

const cookies = new Cookies();


export default function Nav() {
let history = useHistory();
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [matches, setMatches] = useState(window.matchMedia("(min-width: 950px)").matches)
const {setLoginstatus,username} = useContext(data)
const[dropdown,SetDropdown]=useState(false);
const[notification,setNotification]=useState([]);
const focusInput = useRef();

const handleClose = () => {
    SetDropdown(false);
  };

const Logout = ()=>{
    axios.get("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/logout-2")
        .then((response)=>{
            console.log(response.data.LoggedOut);
            setLoginstatus(false);
            localStorage.removeItem('token');
            cookies.remove('ssid');
            history.go('./login')
        });
}

useEffect(() => {
    const handler = (e) => setMatches( e.matches );
    window.matchMedia("(min-width: 950px)").addListener(handler);
},[])



const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleCloseNotification = () => {
  setAnchorEl(null);
};

const Notification = ()=>{
    //var today = new Date();           
    //const formattedtoday = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    
    const body = {branch:branchname, date:new Date().toLocaleDateString('fr-CA')}
    axios.post("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/notification-2",body)
    .then((response)=>{
        console.log(response);
        setNotification(response.data.result)
    });
}

    return (
            <div className="NavStack">
                <div className="NavBar">
                    {matches &&
                        <div className="CategoryNav">
                            <div className="NavBar_categories_li" id="categorey_container" onClick={()=>history.push('/')}>
                               <div className="Category_Nav_li" id="nav_left_li"><span className="category_name"><HiOutlineHome className="category_icons"/> الرئيسية</span></div>
                            </div>
                            <Books />
                            <Adds/>
                            <Store />
                            <Inquiries />
                        </div>
                    }
                    <div className="NavBar_user_info">
                        


                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title="Account settings">
                            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} >
                                <Avatar sx={{ width: 32, height: 32 }}><MdOutlineNotificationsNone className="notification_icon"/></Avatar>
                                <span className="nf_count">{notification.length}</span>
                            </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu anchorEl={anchorEl} id="account-menu" open={open}
                            onClose={handleCloseNotification} onClick={handleCloseNotification} PaperProps={{ elevation: 0, sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                                },
                                '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                                },
                            },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <div className="nf_h1">الاقساط المطالب سدادها اليوم</div>
                            {notification.map((item,key)=>
                                <MenuItem >
                                <div className="notification_li" onClick={()=>{history.push(`/qst-loop/${item.code}`)}}>
                                    <div className="nf_username"><Avatar />
                                    <div style={{display:'block', textAlign:'justify'}}>
                                       {item.username}
                                        <div className="nf_id">{item.nat_id}</div>
                                    </div>
                                     </div>
                                    
                                    <div className="nf_premuim">{item.premium}: قيمة القسط </div>
                                </div>
                                </MenuItem>
                            )}
                        </Menu>









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
                    <Button variant="text" className="NavBar_dropdown_menu_li" onClick={()=>history.push('./dashboard/end-day')}> لوحة التحكم</Button>
                    {/* <Button variant="text" className="NavBar_dropdown_menu_li"> اعدادات الحساب</Button> */}
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
