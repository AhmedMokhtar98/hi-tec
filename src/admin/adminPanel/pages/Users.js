import React, { useState,useEffect, useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios'
import './tables.css'
import jwt_decode from "jwt-decode";
import  Button  from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {BiBlock} from 'react-icons/bi';
import {BsClockHistory} from 'react-icons/bs';
import {VscAccount} from 'react-icons/vsc';
import {MdDoneOutline} from 'react-icons/md';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import BranchFilter from './../../../pages/components/BranchFilter';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Users() {
const history = useHistory()
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');
const [users_count , setUsersCount] = useState('');
const [CachedData, setCachedData] = useState([])
const [Data, setData] = useState([])
const [CurrentUserData, setCurrentUserData] = useState([])
const [CurrNatID, setCurrNatID] = useState()
const [loading , setloading] = useState(true);
const [search , setSearch] = useState('');
const[matches,setMatches] = useState(window.matchMedia("(min-width: 760px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 1075px)").matches)
const [popup, setPopup] = useState({ show: false, id: null});
const [loadingSmall, setloadingSmall] = useState(false);
const [status, setStatus] = useState('');
const [UsersStatus] = useState([
    {status:'all',status_ar:'الكل'},
    {status:'accepted',status_ar:'نشط'},
    {status:'pending',status_ar:'معلق'},
    {status:'rejected',status_ar:'مرفوض'},
]);


useEffect(() => {
    const handler = (e) => setMatches( e.matches ); 
    const handler2 = (e) => setMatches2( e.matches ); 
    window.matchMedia("(min-width: 760px)").addListener(handler)
    window.matchMedia("(min-width: 1075px)").addListener(handler2)
},[])
const [open, setOpen] = React.useState(false);

const GetData = async()=>{
    const body = {branch:branchname, bransh:bransh, auth:auth, status:status}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/dashboard-clients-2',body,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
         setUsersCount(response.data.result.length)
         setData(response.data.result)
         setCachedData(response.data.result)
         setloading(false)
     })
}

useEffect(()=>{
    GetData()
},[])

const HandleSearch = (e)=>{
    setSearch(e.target.value)
    if (e.target.value.length == 0) { setData(CachedData)}
}
const searchData = ()=>{
const searchValue = search.toLowerCase().trim();

const searchQuery = CachedData.filter((query) => {
    return Object.keys(query).some(key => 
      (typeof query[key] === 'string' && query[key].includes(searchValue))
      || (typeof query[key] === 'number') && query[key] === Number(searchValue))
  })
setData(searchQuery)
}

const X_Search = ()=>{
    setSearch('')
    setData(CachedData)
}

const UpdateRow = (i)=>{
    const arr = [...Data]
    setCurrentUserData([arr[i]])
    const nat_id = arr[i]['nat_id']
    setCurrNatID(nat_id)
    setOpen(true);
}

const HandleChange = (e,key)=>{
    const arr = [...Data]
    arr[key][e.target.name] = e.target.value
    setData(arr)
}
const UpdateData = async(i)=>{
    const body = {
        key:CurrNatID,
        username:Data[i]['username'],
        nat_id:Data[i]['nat_id'], 
        phone_number:Data[i]['phone_number'],
        address:Data[i]['address'],
        job:Data[i]['job'],
        salary:Data[i]['salary'],
        work_address:Data[i]['work_address'],
    }
     await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-update-clients-2',body,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
         setOpen(false);
     })
}

/*--------Delete Popup confirm-----------*/
const deleteAlertHandle = (id)=>{  setPopup({show:true, id:id })  }
const DeleteUser = async()=>{
     alert(popup.id)   
     await axios.delete(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-delete-client-2/${popup.id}`,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
        setData(Data.filter((val)=>{
            return val.nat_id != popup.id
        }))
       setloadingSmall(false)
       setPopup({show:false,  id:null})
    })
}
useEffect(() => { GetData() }, [bransh])
const SetBranch = (e)=>{
    const sort = e.target.value;
    setBransh(sort);
    const q = params.get('branch');
    var url = new URL(window.location);
    (url.searchParams.has('branch') ? url.searchParams.set('branch',sort) : url.searchParams.append('branch',sort));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    GetData()
}

useEffect(() => {
    GetData()
}, [status])


    return (
        <div className="dashboard_center_content_container">
            <div className="users_cards" style={{display:'block'}}>
                <div className="users_card">
                    <div className="words_prefix">عدد العملاء</div>
                    {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                        <div className="words_suffix"> {users_count}</div>
                    }
                  
                </div>
                <div className="filter_type_div">
                    <div className="filter_type_header">الحالة</div>
                    <select name="branch_name" id="add_cash_select_branch" className="add_cash_input"  onChange={(e)=>{ setStatus(e.target.value);}} className="filter_option" required>
                            {UsersStatus.map((item,key)=>
                                <option value={`${item.status}`}>{item.status_ar}</option>
                            )}
                    </select>
                </div>
            </div>
            <div className="table_grap" >
                <div className="branchcorner"> {auth != 'admin'  ? '': <BranchFilter bransh={bransh} SetBranch={SetBranch} />}</div>
                <div className="table_search_contents_ap">
                        <div className="search_box">
                                <input className="table_content_search_input" type="text" value={search}  onChange={(e)=>HandleSearch(e)} placeholder="ابحث هنا..." />  
                        </div>
                        {search.length > 0 &&
                        <button className="search_btn" id="emptySearchBtn" onClick={X_Search} >X</button>
                        }
                        <button className="search_btn" onClick={searchData} >بحث</button>
                </div>
  
                <table id="table_id" style={{direction:'rtl',width:matches2 ? "80%" : "100%"}}>
                {matches &&
                    <tr className="table_tr">
                        <th className="table_th">اسم العميل</th>
                        <th className="table_th">رقم الهاتف</th>
                        <th className="table_th">الرقم القومي</th>
                        <th className="table_th">العنوان</th>
                        <th className="table_th">الوظيفة</th>
                        <th className="table_th">تاريخ التسجيل</th>
                        <th className="table_th"> المعرض</th>
                        <th className="table_th"> تعديل</th>
                        <th className="table_th"> حذف</th>
                        <th className="table_th"> الحالة</th>
                    </tr>
                    }
                    {Data.map((items, key)=>(
                        <>
                        <tr className="table_tr" key={key+1}  >  
                            <td className="ap_users_td" onClick={()=>{history.push(`/dashboard/users/${items.nat_id}`)}}><VscAccount className="profile_ico"/></td>
                            <td className="ap_users_td">{items.username}</td>
                            <td className="ap_users_td">{items.phone_number}</td>
                            <td className="ap_users_td">{items.nat_id}</td>
                            <td className="ap_users_td">{items.address}</td>
                            <td className="ap_users_td">{items.job}</td>
                            <td className="ap_users_td">{items.date}</td>
                            <td className="ap_users_td">{items.branch} </td>
                            <td className="ap_users_td">{items.status !='pending'  ? <Button onClick={(e)=>UpdateRow(key)} variant="contained" >تعديل</Button> : '-'} </td>
                            <td className="ap_users_td"><Button onClick={(e) =>deleteAlertHandle(items.nat_id)} style={{background:'rgb(255 69 69)'}} variant="contained"  >حذف</Button></td>
                            <td onClick={()=>{if(items.status ==='pending') history.push(`/inquiries/${items.nat_id}`)}} style={{background:'rgb(35 35 35)',  borderBottom:'solid 1px white'}} className="ap_users_td">{items.status ==='pending' ? <div className="clients_status_span">{/*<div>معلق</div>*/}<BsClockHistory style={{color:'rgb(255 188 0)', fontSize:'20px'}}/></div> : items.status ==='accepted' ? <div className="clients_status_span">{/*<div>مقبول</div>*/}<MdDoneOutline style={{color:'rgb(97 255 97)', fontSize:'20px'}}/>  </div>: items.status === 'rejected' && <div className="clients_status_span">{/*<div>مرفوض</div>*/}<BiBlock style={{color:'rgb(255 0 0)', fontSize:'20px'}}/>  </div>}</td>
                        </tr>
                        {CurrentUserData.map((item,key)=>
                        <>
                        {item.nat_id === items.nat_id && 
                        <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={()=>setOpen(false)} aria-describedby="alert-dialog-slide-description">
                            <DialogTitle>{"تعديل بيانات العميل"}</DialogTitle>
                            <DialogContent>
                                <>
                                <div><input name="username"  onChange={(e)=>HandleChange(e,key)} value={item.username} className="ap_users_update_input"/>اسم العميل</div>
                                <div><input name="nat_id"  onChange={(e)=>HandleChange(e,key)} value={item.nat_id} className="ap_users_update_input"/>الرقم القومي</div>
                                <div><input name="address"  onChange={(e)=>HandleChange(e,key)} value={item.address} className="ap_users_update_input"/>العنوان</div>
                                <div><input name="job"  onChange={(e)=>HandleChange(e,key)} value={item.job} className="ap_users_update_input"/>الوظيفة</div>
                                <div><input name="work_address"  onChange={(e)=>HandleChange(e,key)} value={item.work_address} className="ap_users_update_input"/>عنوان العمل</div>
                                <div><input name="salary"  onChange={(e)=>HandleChange(e,key)} value={item.salary} className="ap_users_update_input"/>الراتب</div>
                                <div><input name="phone_number"  onChange={(e)=>HandleChange(e,key)} value={item.phone_number} className="ap_users_update_input"/>رقم الهاتف</div>
                                </>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={()=>setOpen(false)} variant="contained" style={{background:'red'}}>الغاء</Button>
                            <Button onClick={(e)=>UpdateData(key)} variant="contained" style={{background:'green'}}>تأكيد</Button>
                        </DialogActions>
                        </Dialog>
                        }
                        </>
                    )}
                  </>
                    ))} 
                </table>
        
   
        </div>
        {popup.show ? 
                <div className="Are_you_sure_delete_container">
                    <div className="Are_you_sure_delete_div">
                    {loadingSmall ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                        <>
                            <div className="Are_you_sure_delete_word" >هل انت متأكد من حذف الملف ?</div>
                        <button className="handel_delete_btns" id="confirm_delete_btn" onClick={DeleteUser}>نعم</button>   
                        <button className="handel_delete_btns" id="cancel_delete_btn" onClick={()=>setPopup({show:false,id:null})}>لا</button>
                        </>
                    }
                    </div> 
                </div>
            : ''}
        </div>
    )
}
