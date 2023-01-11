import React, { useState,useEffect,useContext,useMemo } from 'react'
import axios from 'axios';
import HeaderMenu from './../../components/HeaderMenu';
import  Button  from '@mui/material/Button';
import { BsTrash} from 'react-icons/bs'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import arLocale from "date-fns/locale/ar-EG";
import './products.css'
import GoBack from './../../components/Back';
import jwt_decode from "jwt-decode";
import BranchFilter from './../../components/BranchFilter';

const localeMap = {
  ar: arLocale,
};

export default function Products() {
const[branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const [loading, setLoading] = useState(true)
const[connect_msg, setConnectMsg]=useState(false)
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 850px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 760px)").matches)
const [locale] = useState('ar')
const [date, setDateValue] = React.useState(new Date());
const [search , setSearch] = useState('');
const [CachedData, setCachedData] = useState([])
const [Data, setData] = useState([])
const [OverallPrice, setOverallPrice] = useState(null)
const [popup, setPopup] = useState({ show: false, id: null});
const [loadingSmall, setloadingSmall] = useState(false);




useEffect(() => { 
   GetData()
 }, [])
/*-------------------handle Search-----------------------*/
const HandleSearch = (e)=>{
    setSearch(e.target.value)
    if (e.target.value.length == 0) { setData(CachedData)}
}

const searchData = ()=>{
    const searchValue = search.toLowerCase().trim();
    const filteredData = CachedData.filter((item) => {
        return Object.keys(item).some((key) => item[key].toString().toLowerCase().indexOf(searchValue)> -1 );
    });
    setData(filteredData)
}

const X_Search = ()=>{
    setSearch('')
    setData(CachedData)
}
const GetData = ()=>{
    const body = {branch:branchname, bransh:bransh, auth:auth}
    axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/products`,body,{
    headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        const x = response.data.result
        const y = x.map((item)=>{return {...item,upState:false}})
        setData(y)
        setCachedData(response.data.result)
        setLoading(false)
    })
    .catch((err)=>{
        setLoading(false)
        setConnectMsg(true)
        setTimeout(() => { setConnectMsg(false) }, 1500);
    })
}

const UpdateRow = (i)=>{
    const arr = [...Data]
    arr[i]['upState'] = true
    setData(arr)
}

const CancelRow = (i)=>{
    const arr = [...Data]
    arr[i]['upState'] = false
    setData(arr)
}
const HandleChange = (e,i)=>{
    const arr = [...Data]
    arr[i][e.target.name] = e.target.value
    setData(arr)
}
const UpdateData = async(i,product_id)=>{
    const body = {product_id:product_id, product_name:Data[i]['product_name'], product_price:Data[i]['product_price'], quantity:Data[i]['quantity']}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-update-products',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        const arr = [...Data]
        arr[i]['upState'] = false
        setData(arr)
    })
}

/*--------Delete Popup confirm-----------*/
const deleteAlertHandle = (id)=>{  setPopup({show:true, id:id })  }

const DeleteProduct = async()=>{
    alert(popup.id)
    await axios.delete(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-delete-product/${popup.id}`,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
       setData(Data.filter((val)=>{
           return val.product_id != popup.id
       }))
       setloadingSmall(false)
       setPopup({show:false,  id:null})
   })
}
useEffect(() => {
    GetData()
}, [bransh])


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


/*-------------------------Leashed--------------------------*/
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 850px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 760px)").addListener(handler2)},[])

    return (
        <div className="Page_Container">
            <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">المنتجات 
                <span className="products_count">( عدد المنتجات {Data.length} )</span>
                </div>
            </div>
            <div className="table_grap">
            {auth === 'admin'  ||  auth === 'marketing' ?  <BranchFilter bransh={bransh} SetBranch={SetBranch} /> : ''}
                <div className="table_search_contents">
                        <div className="search_box">
                                <input className="table_content_search_input" type="text" value={search}  onChange={(e)=>HandleSearch(e)} placeholder="Search..." />  
                        </div>
                        {search.length > 0 &&
                        <button className="search_btn" id="emptySearchBtn" onClick={X_Search} >X</button>
                        }
                        <button className="search_btn" onClick={searchData} >بحث</button>
                </div>
                <table id="table_id">
                {matches2 &&
                    <tr className="table_tr">
                        <th className="table_th">اسم المنتج </th>
                        <th className="table_th">سعر الوحدة</th>
                        <th className="table_th">الكمية</th>
                        <th className="table_th">المعرض</th>
                        <th className="table_th">تعديل</th>
                        <th className="table_th">حذف</th>
                    </tr>
                    }
            {loading ? <div className="spinner_container"><div className="spinner spinner-circle"></div></div> :
            <>
            {Data.length>0 ? 
            <>
                    {Data.map((item, i)=>(
                        <tr className="table_tr" key={i+1}  >  
                            <td className="products_td_admin">{item.upState ?  <input name="product_name"  onChange={(e)=>HandleChange(e,i)} value={item.product_name} className="ap_update_date_input"/> : item.product_name }</td>
                            <td className="products_td_admin">{item.upState ?  <input name="product_price" onChange={(e)=>HandleChange(e,i)} value={item.product_price} className="ap_update_date_input"/> : item.product_price} جنية</td>
                            <td className="products_td_admin">{item.upState ?  <input name="quantity" onChange={(e)=>HandleChange(e,i)} value={item.quantity} className="ap_update_date_input"/> : item.quantity}</td>
                            <td className="products_td_admin">{item.branch}</td>
                            {item.upState ?  
                            <td className="products_td_admin">
                                <Button onClick={(e)=>CancelRow(i)} variant="contained" className="admin_panel_update_button" style={{background:'red'}}>الغاء</Button>
                                <Button onClick={(e)=>UpdateData(i,item.product_id)} variant="contained" className="admin_panel_update_button" style={{background:'green'}}>تأكيد</Button>
                            </td>
                            : 
                            <td className="products_td_admin"><Button onClick={(e)=>UpdateRow(i)} variant="contained" className="admin_panel_update_button">تعديل</Button></td>
                            }
                            <td className="table_td cashes_td"><div className="cashes_td_value"  onClick={(e) =>deleteAlertHandle(item.product_id)}><Button variant="contained" className="cash_orders_buttin_delete" ><BsTrash id="users_delete_btn"/> </Button></div></td>
                        </tr>
                    ))} 
                    </>
            : <div className="No_Data_Syntax">لا توجد بيانات</div>}
            </>
            } 
                </table>
        </div>
                 
        {popup.show ? 
            <div className="Are_you_sure_delete_container">
                <div className="Are_you_sure_delete_div">
                {loadingSmall ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                    <>
                        <div className="Are_you_sure_delete_word" >هل انت متأكد من حذف الملف ?</div>
                    <button className="handel_delete_btns" id="confirm_delete_btn" onClick={DeleteProduct}>نعم</button>   
                    <button className="handel_delete_btns" id="cancel_delete_btn" onClick={()=>setPopup({show:false,id:null})}>لا</button>
                    </>
                 }
                </div> 
            </div>
            : ''}
        <div className={connect_msg ? "Connect_Dialog_hidden Connect_Dialog_show" : "Connect_Dialog_hidden"}> خطأ في الاتصال بالسيرفر!</div>
    </div>
    )
}
