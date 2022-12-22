import React, { useState,useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import './tables.css'
import jwt_decode from "jwt-decode";
import  Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import BranchFilter from './../../../pages/components/BranchFilter';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Garantees() {
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');
const [users_count , setUsersCount] = useState('');
const [CachedData, setCachedData] = useState([])
const [Data, setData] = useState([])
const [CurrNatID, setCurrNatID] = useState()
const [loading , setloading] = useState(true);
const [search , setSearch] = useState('');
const [CurrentUserData, setCurrentUserData] = useState([])
const[matches,setMatches] = useState(window.matchMedia("(min-width: 760px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 1075px)").matches)
const [open, setOpen] = React.useState(false);
const [popup, setPopup] = useState({ show: false, id: null});
const [loadingSmall, setloadingSmall] = useState(false);

useEffect(() => {
    const handler = (e) => setMatches( e.matches ); 
    const handler2 = (e) => setMatches2( e.matches ); 
    window.matchMedia("(min-width: 760px)").addListener(handler)
    window.matchMedia("(min-width: 1075px)").addListener(handler2)
},[])

const GetData = async()=>{
    const body = {branch:branchname, bransh:bransh, auth:auth}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/dashboard-garantees',body,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
         setUsersCount(response.data.result.length)
         setData(response.data.result)
         setCachedData(response.data.result)
         setloading(false)
     })
}

useEffect(()=>{ GetData() },[])

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
    const nat_id = arr[i]['g_nat_id']
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
        g_name:Data[i]['g_name'],
        g_nat_id:Data[i]['g_nat_id'], 
        g_phone_number:Data[i]['g_phone_number'],
        g_address:Data[i]['g_address'],
        g_job:Data[i]['g_job'],
        g_salary:Data[i]['g_salary'],
        g_work_address:Data[i]['g_work_address'],
    }
    console.log('body',body);
     await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-update-garantee',body,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
         setOpen(false);
     })
}
/*--------Delete Popup confirm-----------*/
const deleteAlertHandle = (id)=>{  setPopup({show:true, id:id })  }

const DeleteUser = async()=>{
    await axios.delete(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-delete-garantee/${popup.id}`,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
       setData(Data.filter((val)=>{
           return val.g_nat_id != popup.id
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
    return (
        <div className="dashboard_center_content_container">
            <div className="users_cards">
                <div className="users_card">
                    <div className="words_prefix">عدد الضامنين</div>
                    {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                        <div className="words_suffix"> {users_count}</div>
                    }
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
                        <th className="table_th">اسم الضامن</th>
                        <th className="table_th">رقم الهاتف</th>
                        <th className="table_th">الرقم القومي</th>
                        <th className="table_th">العنوان</th>
                        <th className="table_th">الوظيفة</th>
                        <th className="table_th">العميل</th>
                        <th className="table_th">الرقم القومي للعميل</th>
                        <th className="table_th"> تعديل</th>
                        <th className="table_th"> حذف</th>
                    </tr>
                    }
                    {Data.map((items, i)=>(
                        <>
                        <tr className="table_tr" key={i+1}  >  
                            <td className="ap_garantees_td">{items.g_name}</td>
                            <td className="ap_garantees_td">{items.g_phone_number}</td>
                            <td className="ap_garantees_td">{items.g_nat_id}</td>
                            <td className="ap_garantees_td">{items.g_address}</td>
                            <td className="ap_garantees_td">{items.g_job}</td>
                            <td className="ap_garantees_td">{items.username}</td>
                            <td className="ap_garantees_td">{items.nat_id}</td>
                            <td className="ap_garantees_td"><Button onClick={(e)=>UpdateRow(i)} variant="contained" >تعديل</Button></td>
                            <td className="ap_garantees_td"><Button onClick={(e) =>deleteAlertHandle(items.g_nat_id)}  variant="contained"  style={{background:'rgb(245 79 79)'}}>حذف</Button></td>
                        </tr>
                        {CurrentUserData.map((item,key)=>
                            <>
                            {item.g_nat_id === items.g_nat_id && 
                            <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={()=>setOpen(false)} aria-describedby="alert-dialog-slide-description">
                                <DialogTitle>{"تعديل بيانات العميل"}</DialogTitle>
                                <DialogContent>
                                    <>
                                    <div><input name="g_name"  onChange={(e)=>HandleChange(e,i)} value={item.g_name} className="ap_users_update_input"/>اسم العميل</div>
                                    <div><input name="g_nat_id"  onChange={(e)=>HandleChange(e,i)} value={item.g_nat_id} className="ap_users_update_input"/>الرقم القومي</div>
                                    <div><input name="g_address"  onChange={(e)=>HandleChange(e,i)} value={item.g_address} className="ap_users_update_input"/>العنوان</div>
                                    <div><input name="g_job"  onChange={(e)=>HandleChange(e,i)} value={item.g_job} className="ap_users_update_input"/>الوظيفة</div>
                                    <div><input name="g_work_address"  onChange={(e)=>HandleChange(e,i)} value={item.g_work_address} className="ap_users_update_input"/>عنوان العمل</div>
                                    <div><input name="g_salary"  onChange={(e)=>HandleChange(e,i)} value={item.g_salary} className="ap_users_update_input"/>الراتب</div>
                                    <div><input name="g_phone_number"  onChange={(e)=>HandleChange(e,i)} value={item.g_phone_number} className="ap_users_update_input"/>رقم الهاتف</div>
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
