import React ,{useState,useEffect,useContext,useMemo}from 'react'
import axios from 'axios';
import { BsTrash } from 'react-icons/bs'
import {BiEdit} from 'react-icons/bi'
import {MdOutlineDateRange} from 'react-icons/md'
import '../css/blacklist.css'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import arLocale from "date-fns/locale/ar-EG";
import Pagination from '@mui/material/Pagination';
import HeaderMenu from './../../components/HeaderMenu';
import GoBack from './../../components/Back';
import { NavLink, useHistory } from 'react-router-dom';
import jwt_decode from "jwt-decode";
const localeMap = {
    ar: arLocale,
};
export default function Blacklist() {
const history = useHistory();
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const [date, setDateValue] = React.useState(new Date());
const [locale, setLocale] = React.useState('en');

const [data, setData] = useState([]);

const [loading, setloading] = useState(true);
const [connect_msg, setConnectMsg]=useState(false)
const [loadingSmall, setloadingSmall] = useState(false);

const [currentPage , setCurrentPage] = useState(1);
const [pagesNumbers , setPagesNumbers] = useState();
const [postsPerPage] = useState(20);
const [search , setSearch] = useState('');
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 760px)").matches)
/*-------------------------Leashed--------------------------*/
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 760px)").addListener(handler2)},[])

/*--------Pagination--------------*/
useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    (params.has('page') ? setCurrentPage(parseInt(params.get('page')))  : setCurrentPage(1) );
},[])

const CountOverall = ()=>{
   const body = { branch:branchname}
   axios.post("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/blocked_inquiries_overall_count-2",body)
   .then((response) =>{
       const arr = response.data.result[0]['count']
       const pages_count =  Math.ceil((arr) / postsPerPage);
       setPagesNumbers(pages_count) 
   })
}
useEffect(() => { CountOverall() }, [])



const GetData = async()=>{
    setloading(true)
    const body={branch:branchname,auth:auth, offset:(currentPage-1)*20}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/blocked_inqueries-2',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        setData(response.data.result)
        setloading(false)
    })
    .catch((err)=>{
        setloading(false)
        setConnectMsg(true)
        setTimeout(() => { setConnectMsg(false) }, 1500);
    })
}
const calculationWithMemo = useMemo(() => {
    return GetData();
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



/*-------------Handle Search--------------*/
const HandleSearch = (value)=>{setSearch(value)}

const SubmitSearch = ()=>{
    if(search.length > 0){
        setloading(true)
        const body={branch:branchname, search:search}
        axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/blocked_inqueries_search-2',body,{
            headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
            setData(response.data.result)
            //setCachedData(response.data.result)
            setPagesNumbers(1)
            setloading(false)
        })
        .catch((err)=>{
            setloading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
    }
    else{alert('أكتب للبحث...')}
}

const CancelSearch = ()=>{
    setSearch('');
    CountOverall()
    GetData()
}


const InquiryInfo =(nat_id)=>{ history.push(`/inquiries/${nat_id}`) }
    return (
        <>
       <div className="Page_Container black_list_container">
            <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">عملاء محظورون</div>
            </div>
            <div className="table_grap black_list">
                <div className="table_search_contents">
                    <div className="search_box">
                            <input className="table_content_search_input" type="text" value={search}  onChange={(e)=>HandleSearch(e.target.value)} placeholder="Search..." />  
                    </div>
                      {search.length > 0 &&
                      <button className="search_btn" id="emptySearchBtn" onClick={CancelSearch} >X</button>
                       }
                      <button className="search_btn" onClick={SubmitSearch} >بحث</button>
                    <LocalizationProvider locale={localeMap[locale]} dateAdapter={AdapterDateFns}>
                        <MobileDatePicker id="date_picker"  value={date}  onChange={(newValue) => {setDateValue(newValue); setSearch(newValue.toLocaleDateString('fr-CA')); SubmitSearch(); }} onClick={SubmitSearch}
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
                        <th className="table_th black_list_th">اسم العميل</th>
                        <th className="table_th black_list_th">الرقم القومي</th>
                        <th className="table_th black_list_th">اسم المعرض</th>
                        <th className="table_th black_list_th">التاريخ</th>
                    </tr>
                }
                {loading ? <div className="spinner_container"><div className="spinner spinner-circle"></div></div> 
                : 
                    <>
                        {data.length > 0 ? 
                            <>
                            {data.map((item, i)=>(
                                <tr className="table_tr black_list_tr" key={i} onClick={(e)=>InquiryInfo(item.nat_id)}>  
                                    <td className="table_td inquiries_td black_list_td"> {item.username}</td>
                                    <td className="table_td inquiries_td black_list_td"> {item.nat_id}</td>
                                    <td className="table_td inquiries_td black_list_td"><div>{item.branch}</div></td>
                                    <td className="table_td inquiries_td black_list_td"> {item.date}</td>
                                </tr>
                            ))} 
                            </>
                        : <div className="No_Data_Syntax">لا توجد بيانات</div>}
                    </>
                }
                </table>
                
            </div>
            <div className={connect_msg ? "Connect_Dialog_hidden Connect_Dialog_show" : "Connect_Dialog_hidden"}> خطأ في الاتصال بالسيرفر!</div>
        </div>
            <div className="pagination_ul"><Pagination count={pagesNumbers} page={currentPage} color="primary" onChange={handleSteps} /></div>

  </>
    )
}
