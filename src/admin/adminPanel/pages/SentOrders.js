import React, { useState,useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import './tables.css'
import jwt_decode from "jwt-decode";
import {BsPlusCircleDotted} from "react-icons/bs";
import  Button  from '@mui/material/Button';
import BranchFilter from './../../../pages/components/BranchFilter';
import { useHistory } from "react-router-dom";

export default function SentOrders() {
let history = useHistory();
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');
const [products_count , setProductsCount] = useState('');
const [CachedData, setCachedData] = useState([])
const [Data, setData] = useState([])
const [loading , setloading] = useState(true);
const [search , setSearch] = useState('');
const[matches,setMatches] = useState(window.matchMedia("(min-width: 760px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 1075px)").matches)
const [popup, setPopup] = useState({ show: false, id: null});
const [loadingSmall, setloadingSmall] = useState(false);
useEffect(() => {
    const handler = (e) => setMatches( e.matches ); 
    const handler2 = (e) => setMatches2( e.matches ); 
    window.matchMedia("(min-width: 760px)").addListener(handler)
    window.matchMedia("(min-width: 1075px)").addListener(handler2)
},[])
const GetData = async()=>{
    const body = {branch:branchname}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/sent-transfers',body,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
         const x = response.data.result
         const y = x.map((item)=>{return {...item,upState:false}})
         setData(y)
         setProductsCount(response.data.result.length)
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
const filteredData = CachedData.filter((item) => {
    return Object.keys(item).some((key) => item[key].toString().toLowerCase().indexOf(searchValue)> -1 );
});
setData(filteredData)
}

const X_Search = ()=>{
    setSearch('')
    setData(CachedData)
}


const HandleChange = (e,i)=>{
    const arr = [...Data]
    arr[i][e.target.name] = e.target.value
    setData(arr)
}

/*--------Delete Popup confirm-----------*/
const deleteAlertHandle = (id)=>{  setPopup({show:true, id:id })  }

const DeleteProduct = async()=>{
    alert(popup.id)
    await axios.delete(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/delete-order/${popup.id}`,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
       setData(Data.filter((val)=>{
           return val.id != popup.id
       }))
       setloadingSmall(false)
       setPopup({show:false,  id:null})
   })
}



    return (
        <div className="dashboard_center_content_container">
           <div className="products_cards">
                <div className="products_card">
                    <div className="words_prefix">اجمالي الطلبات</div>
                    {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                        <div className="words_suffix"> {products_count}</div>
                    }
                </div>
                <div className="products_card">
                    <div className="words_prefix"><BsPlusCircleDotted className="add_product_icon" onClick={()=>history.push('/dashboard/order-transfers')}/> </div>
                </div>
            </div>
            <div className="table_grap" >
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
                        <th className="table_th">المعرض</th>
                        <th className="table_th">اسم منتج</th>
                        <th className="table_th">السعر</th>
                        <th className="table_th">الكمية</th>
                        <th className="table_th">الاجمالي</th>
                        <th className="table_th">حذف</th>
                    </tr>
                    }
                    {Data.map((item, i)=>(
                        <tr className="table_tr" key={i+1}  >  
                            <td className="products_td_admin">{item.upState ?  <input name="branch_2" onChange={(e)=>HandleChange(e,i)} value={item.branch_2} className="ap_update_date_input"/> : item.branch_2}</td>
                            <td className="products_td_admin">{item.upState ?  <input name="product_name"  onChange={(e)=>HandleChange(e,i)} value={item.product_name} className="ap_update_date_input"/> : item.product_name }</td>
                            <td className="products_td_admin">{item.upState ?  <input value={item.product_price} className="ap_update_date_input"/> : item.product_price}</td>
                            <td className="products_td_admin">{item.upState ?  <input value={item.qnty} className="ap_update_date_input"/> : item.qnty}</td>
                            <td className="products_td_admin">{item.upState ?  <input value={item.total_price} className="ap_update_date_input"/> : item.total_price}</td>
                            <td className="ap_users_td"><Button onClick={(e) =>deleteAlertHandle(item.id)}  variant="contained"  style={{background:'rgb(245 79 79)'}}>حذف</Button></td>
                        </tr>
                    ))} 
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
        </div>
    )
}
