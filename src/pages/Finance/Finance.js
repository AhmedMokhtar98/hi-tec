import React, { useState,useEffect,useContext } from 'react'
import axios from 'axios';
import HeaderMenu from './../components/HeaderMenu';
import  Button  from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import arLocale from "date-fns/locale/ar-EG";
import './css/finance.css'
import GoBack from './../components/Back';
import jwt_decode from "jwt-decode";
import BranchFilter from './../components/BranchFilter';
const localeMap = {
  ar: arLocale,
};

export default function Finance() {
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 850px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 760px)").matches)
const [locale] = useState('ar')
const [date, setDateValue] = React.useState(new Date());
const [search , setSearch] = useState('');
const [Data, setData] = useState([])
const[loading, setLoading]=useState(false)
const[connect_msg, setConnectMsg]=useState(false)

const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');


const getData = ()=>{
    if(auth != 'admin'){
        const body = {branch:branchname}
        axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/finance`,body,{
                headers:{"x-access-token":localStorage.getItem('token')}
                }).then((response)=>{
                setData(response.data.result);
                setLoading(false)
            })
    }
    else{
        const body = {branch:bransh}
        axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-finance`,body,{
        headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
            setData(response.data.result);
            setLoading(false)
        })
    }
    
}

useEffect(() => { getData(); }, [])
useEffect(()=>{ getData() },[bransh])

const SetBranch = (e)=>{
    setLoading(true)
    const sort = e.target.value;
    setBransh(sort);
    const q = params.get('branch');
    var url = new URL(window.location);
    (url.searchParams.has('branch') ? url.searchParams.set('branch',sort) : url.searchParams.append('branch',sort));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    getData()
}

/*-------------------handle Search-----------------------*/

const HandleSearch = (value)=>{setSearch(value)}
const SubmitSearch = ()=>{
    setLoading(true)
    if(auth != 'admin'){
        const body = {search:search, branch:branchname}
        axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/finance-by-day`,body,{
        headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
        setLoading(false)
        setData(response.data.result);
        })
        .catch((err)=>{
            setLoading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
    }
    else{
        const body = {search:search, branch:bransh}
        axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/finance-by-day`,body,{
        headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
        setLoading(false)
        setData(response.data.result);
        })
        .catch((err)=>{
            setLoading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
    }
}

/*-------------------------Leashed--------------------------*/
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 850px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 760px)").addListener(handler2)},[])
    return (
        <div className="Page_Container">
            <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">دفتر اليومية </div>
            </div>
            
            {auth != 'admin'  ? '': <BranchFilter bransh={bransh} SetBranch={SetBranch} />}
            <div className="table_search_contents">
                    <div className="search_box">
                            <input className="table_content_search_input" type="text" value={search}  onChange={(e)=>HandleSearch(e.target.value)} placeholder="Search..." />  
                    </div>
                      {search.length > 0 &&
                      <button className="search_btn" id="emptySearchBtn" onClick={()=>{setSearch('');getData();}} >X</button>
                       }
                      <button className="search_btn" onClick={SubmitSearch} >بحث</button>
                    <LocalizationProvider locale={localeMap[locale]} dateAdapter={AdapterDateFns}>
                        <MobileDatePicker id="add_cash_date_picker"  value={date}  onChange={(newValue) => {setDateValue(newValue); setSearch(newValue.toLocaleDateString('fr-CA')); SubmitSearch(); }} onClick={SubmitSearch}
                        renderInput={(params) =>
                        <div ref={params.InputProps.ref} className="DatePickerIcon_content">
                            <label {...params.InputLabelProps} ><MdOutlineDateRange className="DatePickerIcon"/> 
                                <input hidden {...params.inputProps}  />
                            </label>
                        </div>
                        }/>
                    </LocalizationProvider>
              </div>
            <table id="table_id">
             {matches2 &&
                <tr className="table_tr_head">
                    <th className=" table_th">الرصيد اخر اليوم</th>
                    <th className=" table_th">اجمالي المنصرف</th>
                    <th className=" table_th">منصرف اخر</th>
                    <th className=" table_th">منصرف بضاعة</th>
                    <th className=" table_th">اجمالي الوارد</th>
                    <th className=" table_th">التحصيل</th>
                    <th className=" table_th">الاستعلامات</th>
                    <th className=" table_th">المقدمات</th>
                    <th className=" table_th">الرصيد اول اليوم</th>
                    <th className=" table_th">التاريخ</th>
                </tr>
             }
             {loading ? <div className="spinner_container"><div className="spinner spinner-circle"></div></div> : 
             <>
            {Data.length>0 ? 
                <>
             {Data.map((item, i)=>(
                    <>
             {matches2 ?
              <tr className="table_tr" key={i+1}  >  
                        <td className=" table_td finance_td" id="finance_final_account">{item.final_account}</td>
                        <td className=" table_td finance_td">{item.total_expenses}</td>
                        <td className=" table_td finance_td">{item.other_expenses}</td>
                        <td className=" table_td finance_td">{item.product_expenses}</td>
                        <td className=" table_td finance_td">{item.total_income}</td>
                        <td className=" table_td finance_td">{item.total_premium}</td>
                        <td className=" table_td finance_td">{item.inquiry}</td>
                        <td className=" table_td finance_td">{item.advance}</td>
                        <td className=" table_td finance_td" id="finance_initial_account">{item.initial_account}</td>
                        <td className=" table_td finance_td" id="finance_date">{item.date}</td>
                    </tr>
                   :
                    <tr className="table_tr" key={i+1}  >  
                        <td className=" table_td finance_td" id="finance_date">{item.date}</td>
                        <td className=" table_td finance_td" id="finance_final_account">{item.final_account}</td>
                        <td className=" table_td finance_td">{item.total_expenses}</td>
                        <td className=" table_td finance_td">{item.other_expenses}</td>
                        <td className=" table_td finance_td">{item.product_expenses}</td>
                        <td className=" table_td finance_td">{item.total_income}</td>
                        <td className=" table_td finance_td">{item.total_premium}</td>
                        <td className=" table_td finance_td">{item.inquiry}</td>
                        <td className=" table_td finance_td">{item.advance}</td>
                        <td className=" table_td finance_td" id="finance_initial_account">{item.initial_account}</td>
                    </tr>
            }
                    </>
                ))} 
                 </>
                : <div className="No_Data_Syntax">لا توجد بيانات</div>} 
                </>
            }
            </table>
            <div className={connect_msg ? "Connect_Dialog_hidden Connect_Dialog_show" : "Connect_Dialog_hidden"}> خطأ في الاتصال بالسيرفر!</div>
        </div>
    )
}
