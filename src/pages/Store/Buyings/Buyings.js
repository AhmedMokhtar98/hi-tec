import React, { useState,useEffect,useContext,useMemo } from 'react'
import axios from 'axios';
import HeaderMenu from './../../components/HeaderMenu';
import  Button  from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import arLocale from "date-fns/locale/ar-EG";
import GoBack from './../../components/Back';
import jwt_decode from "jwt-decode";
import Pagination from '@mui/material/Pagination';
import './css/buyings.css'
import BranchFilter from './../../components/BranchFilter';
const localeMap = {
  ar: arLocale,
};

export default function Buyings() {
const [branchname, setBranchName]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 850px)").matches)
const [locale] = useState('ar')
const [date, setDateValue] = React.useState(new Date());
//const [search , setSearch] = useState(new Date().toLocaleDateString('fr-CA'));
const [search , setSearch] = useState('');
const [Data, setData] = useState([])
const [OverallPrice, setOverallPrice] = useState(null)
const[loading, setLoading]=useState(false)
const[connect_msg, setConnectMsg]=useState(false)
const [currentPage , setCurrentPage] = useState(1);
const [pagesNumbers , setPagesNumbers] = useState();
const [searchType , setsearchType] = useState('');
const [postsPerPage] = useState(10);

const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');

/*--------Pagination--------------*/
useEffect(async () => {
    const params = new URLSearchParams(window.location.search);
    (params.has('page') ? setCurrentPage(parseInt(params.get('page')))  : setCurrentPage(1) );
},[])

const CountOverall = ()=>{
    const body = { branch:branchname}
    axios.post("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/buyings-count",body,{
        headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
        const arr = response.data.result[0]['count']
        const pages_count =  Math.ceil((arr) / postsPerPage);
        setPagesNumbers(pages_count) 
    })
 }
 useEffect(async () => { CountOverall() }, [])
 useEffect(async () => { CountOverall() }, [bransh])

/*-------------------handle Search-----------------------*/
const HandleSearch = (value)=>{setSearch(value);  setsearchType('text');}

const SubmitSearch = ()=>{
    setLoading(true)
    if(auth != 'admin'){
        const data = {search:search, searchType:searchType, branch:branchname, offset:(currentPage-1)*10}
            axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/buyings-view`,data,{
            headers:{"x-access-token":localStorage.getItem('token')}
            }).then((response)=>{
                setLoading(false)
                setData(response.data.result);
                const length = response.data.result.length
                const data = response.data.result
                var total = 0
                for(var i=0;i<length;i++){
                total = total + data[i]['overall_price']
                setOverallPrice(total)
            }
        })
        .catch((err)=>{
            setLoading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
    }
    else{
        const data = {search:search, searchType:searchType, branch:bransh ,offset:(currentPage-1)*10}
        axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-buyings-view`,data,{
            headers:{"x-access-token":localStorage.getItem('token')}
            }).then((response)=>{
            setLoading(false)
            setData(response.data.result);
            const length = response.data.result.length
            const data = response.data.result
            var total = 0
            for(var i=0;i<length;i++){
            total = total + data[i]['overall_price']
            setOverallPrice(total)
            }
        })
        .catch((err)=>{
            setLoading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
    }
}
const calculationWithMemo = useMemo(() => {
    return SubmitSearch();
}, [currentPage]);


const handleSteps = (event, value) => { 
    setCurrentPage(value)
    var url = new URL(window.location);
    (url.searchParams.has('page') ? url.searchParams.set('page',value) : url.searchParams.append('page',value));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    scrollToTop()
}
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

useEffect(() => { SubmitSearch() }, [bransh])

const SetBranch = (e)=>{
    const sort = e.target.value;
    setBransh(sort);
    setBranchName(sort);
    const q = params.get('branch');
    var url = new URL(window.location);
    (url.searchParams.has('branch') ? url.searchParams.set('branch',sort) : url.searchParams.append('branch',sort));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    SubmitSearch()
    CountOverall()
}

/*-------------------------Leashed--------------------------*/
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 850px)").addListener(handler2)},[])
   
    return (
        <>
        <div className="Page_Container">
            <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">دفتر المشتريات</div>
            </div>
            <div className="table_grap">
                <div className="table_header_flex">
                            {auth != 'admin'  ? '': <BranchFilter bransh={bransh} SetBranch={SetBranch} />}
                    <div className="table_search_contents">
                            <div className="search_box">
                                    <input className="table_content_search_input" type="text" value={search}  onChange={(e)=>HandleSearch(e.target.value)} placeholder="Search..." />  
                            </div>
                            {search.length > 0 &&
                            <button className="search_btn" id="emptySearchBtn" onClick={()=>{setSearch('');} } >X</button>
                            }
                            <button className="search_btn" onClick={SubmitSearch} >بحث</button>
                            <LocalizationProvider locale={localeMap[locale]} dateAdapter={AdapterDateFns}>
                                <MobileDatePicker id="add_cash_date_picker"  value={date}  onChange={(newValue) => {setDateValue(newValue); setsearchType('date'); setSearch(newValue.toLocaleDateString('fr-CA')); SubmitSearch(); }} onClick={SubmitSearch}
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
                            <th className="table_th" id="Buyings_name_th">التاجر</th>
                            <th className="table_th">المنتج</th>
                            <th className="table_th">السعر</th>
                            <th className="table_th">الكمية</th>
                            <th className="table_th">الاجمالي</th>
                            <th className="table_th">الملاحظات</th>
                        </tr>
                        }
                            {Data.length>0 ? 
                            <>
                            {Data.map((item, i)=>(
                                <tr className="table_tr buyings_tr" key={i+1}  >  
                                    <td className="table_td buyings_td">{item.dealer}</td>
                                    <td className="table_td buyings_td">{item.product_name}</td>
                                    <td className="table_td buyings_td">{item.product_price}</td>
                                    <td className="table_td buyings_td">{item.quantity}</td>
                                    <td className="table_td buyings_td">{item.overall_price}</td>
                                    <td className="table_td buyings_td">{item.notes.length > 0 ? item.notes : 'لا توجد ملاحظات'}</td>
                                </tr>
                            ))} 
                            </>
                            : <div className="No_Data_Syntax">لا توجد بيانات</div>} 
                    
                    </table>
                    {/*<div className={OverallPrice > 0 ?"Total__collect Total__collect_show":"Total__collect Total__collect_hide"}>
                        <div className="Total__li Total__li_total"> الاجمالي /</div>
                        <div className="Total__li Total__li_overall">{OverallPrice}</div>
                    </div>*/}
                </div>
            <div className={connect_msg ? "Connect_Dialog_hidden Connect_Dialog_show" : "Connect_Dialog_hidden"}> خطأ في الاتصال بالسيرفر!</div>
        </div>
    </div>
        <div className="pagination_ul"><Pagination count={pagesNumbers} page={currentPage} color="primary" onChange={handleSteps} /></div>
    </>
    )
}
