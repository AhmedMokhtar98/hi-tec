import React, { useState,useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import './tables.css'
import jwt_decode from "jwt-decode";
import {BsPlusCircleDotted} from "react-icons/bs";
import  Button  from '@mui/material/Button';
import BranchFilter from './../../../pages/components/BranchFilter';
import { useHistory } from "react-router-dom";

export default function RateClients_EndedQsts() {
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


const GetData = async()=>{
    const body = {branch:bransh}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/finished_qsts',body,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
         console.log(response.data.result);

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

useEffect(() => { GetData() }, [bransh])
useEffect(() => {
    const handler = (e) => setMatches( e.matches ); 
    const handler2 = (e) => setMatches2( e.matches ); 
    window.matchMedia("(min-width: 760px)").addListener(handler)
    window.matchMedia("(min-width: 1075px)").addListener(handler2)
},[])



    return (
        <div className="dashboard_center_content_container">
           <div className="products_cards">
                <div className="products_card">
                    <div className="words_prefix">عدد البيعات المنتهية</div>
                    {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                        <div className="words_suffix"> {products_count}</div>
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
                        <th className="table_th">كود البيعة</th>
                        <th className="table_th">القومي</th>
                        <th className="table_th">اسم العميل</th>
                        <th className="table_th">المعرض</th>
                        <th className="table_th">التاريخ</th>
                    </tr>
                    }
                    {Data.map((item, i)=>(
                        <tr className="table_tr" key={i+1}  onClick={()=>history.push(`/dashboard/ended-qsts/rate-users/${item.code}`)}>  
                            <td className="products_td_admin"> {item.code }</td>
                            <td className="products_td_admin">{item.nat_id }</td>
                            <td className="products_td_admin"> {item.username} </td>
                            <td className="products_td_admin">{item.branch}</td>
                            <td className="products_td_admin">{item.date}</td>
                        </tr>
                    ))} 
                </table>
                
        </div>

        </div>
    )
}
