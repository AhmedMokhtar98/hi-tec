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
import './css/advances.css';
import GoBack from './../components/Back';
import jwt_decode from "jwt-decode";
import BranchFilter from './../components/BranchFilter';
const localeMap = {
  ar: arLocale,
};
export default function Advances() {
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const [loading, setLoading] = useState(true)
const [date, setDateValue] = React.useState(new Date());
const [SearchType, setSearchType] = useState('date');
const [search , setSearch] = useState('');
//const [search , setSearch] = useState(new Date().toLocaleDateString('fr-CA'));
const [Data, setData] = useState([])
const [OverallPrice, setOverallPrice] = useState(null)
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 760px)").matches)
const [locale] = useState('ar')
const[connect_msg, setConnectMsg]=useState(false)


const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');



/*-------------------handle Search-----------------------*/
const HandleSearch = (value)=>{setSearch(value)}
const selectSearchType = (e)=>{setSearchType(e.target.value)}
const SubmitSearch = ()=>{
    if(auth != 'admin'){
        const body = {search:search,type:SearchType, branch:branchname}
            axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/advances`,body,{
            headers:{"x-access-token":localStorage.getItem('token')}
            }).then((response)=>{
            setData(response.data.result);
            const length = response.data.result.length
            const data = response.data.result
            var total = 0
            for(var i=0;i<length;i++){
            total = total + data[i]['prepaid']
            setOverallPrice(total)
            }
            setLoading(false)
        })
        .catch((err)=>{
            setLoading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
    }
    else{
        const body = {search:search,type:SearchType, branch:bransh}
        axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-advances`,body,{
        headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
            setData(response.data.result);
            const length = response.data.result.length
            const data = response.data.result
            var total = 0
            for(var i=0;i<length;i++){
            total = total + data[i]['prepaid']
            setOverallPrice(total)
            }
            setLoading(false)
        })
        .catch((err)=>{
            setLoading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
}
}
const SetBranch = (e)=>{
    const sort = e.target.value;
    setBransh(sort);
    const q = params.get('branch');
    var url = new URL(window.location);
    (url.searchParams.has('branch') ? url.searchParams.set('branch',sort) : url.searchParams.append('branch',sort));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    SubmitSearch()
}
useEffect(() => { SubmitSearch()}, [])
useEffect(()=>{ SubmitSearch() },[bransh])


/*-------------------------Leashed--------------------------*/
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 760px)").addListener(handler2)},[])
    return (
        <div className="Page_Container">
            <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">دفتر المقدمات</div>
            </div>
            {auth != 'admin'  ? '': <BranchFilter bransh={bransh} SetBranch={SetBranch} />}
            <div className="table_grap">
                <div className="table_header_flex">
                    <div className="table_search_contents">
                        <div className="search_box">
                                <input className="table_content_search_input" type="text" value={search}  onChange={(e)=>HandleSearch(e.target.value)} placeholder="Search..." disabled={SearchType=='date'?true:false}/>  
                        </div>
                        {search.length > 0 &&
                        <button className="search_btn" id="emptySearchBtn" onClick={()=>{setSearch('')}} >X</button>
                        }
                        <button className="search_btn" onClick={SubmitSearch} >بحث</button>
                        <select value={SearchType} onChange={(e)=>selectSearchType(e)}>
                            <option value="code">الكود</option>
                            <option value="date">التاريخ</option>
                        </select>
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
                                    <th className="table_th" id="advances_preprepaid_th">المقدم</th>
                                    <th className="table_th">القسط</th>
                                    <th className="table_th">المدة</th>
                                    <th className="table_th">البضاعة</th>
                                    <th className="table_th">الكود</th>
                                    <th className="table_th">الاسم</th>
                                </tr>
                            }
                            {loading ? <div className="spinner_container"><div className="spinner spinner-circle"></div></div> :
                            <>
                            {Data.length>0 ? 
                            <>
                                {Data.map((item, i)=>(
                                    <tr className="table_tr">  
                                        <td className="table_td advances_td" id="advances_prepaid_td">{item.prepaid}</td>
                                        <td className="table_td advances_td" id="advances_prepaid_td">{item.premium}</td>
                                        <td className="table_td advances_td" id="advances_prepaid_td">{item.period}</td>
                                        <td className="table_td advances_td">{item.product_name}</td>
                                        <td className="table_td advances_td">{item.code}</td>
                                        <td className="table_td advances_td" id="advances_username_td"> {item.username}</td>
                                    </tr>
                                ))} 
                            </>
                            : <div className="No_Data_Syntax">لا توجد بيانات</div>}
                            </>
                            } 
                        </table>
                        <div className={OverallPrice > 0 ?"Total__collect Total__collect_show":"Total__collect Total__collect_hide"}>
                            <div className="Total__li Total__li_total">الاجمالي</div>
                            <div className="Total__li Total__li_overall">{OverallPrice}</div>
                        </div>
                    </div>
                </div>
                <div className={connect_msg ? "Connect_Dialog_hidden Connect_Dialog_show" : "Connect_Dialog_hidden"}> خطأ في الاتصال بالسيرفر!</div>
            </div>
    )
}

