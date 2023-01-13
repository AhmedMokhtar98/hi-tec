import React,{useState,useContext,useEffect} from 'react'
import axios from 'axios';
import { BsTrash } from 'react-icons/bs'
import {BiEdit} from 'react-icons/bi'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import enLocale from "date-fns/locale/en-GB";
import Pagination from '@mui/material/Pagination';
import { NavLink, useHistory } from 'react-router-dom';
import GoBack from './../../components/Back';
import HeaderMenu from './../../components/HeaderMenu';
import jwt_decode from "jwt-decode";
import './css/qst_data.css';
import BranchFilter from './../../components/BranchFilter';
const localeMap = {
  en: enLocale,
};

export default function QstData() {
const history = useHistory();
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const [date, setDateValue] = React.useState(new Date());
const [locale, setLocale] = React.useState('en');
const [data, setData] = useState([]);
const [filtered_data, setFilteredData] = useState([]);
const [loading, setloading] = useState(true);
const[connect_msg, setConnectMsg]=useState(false)
const [loadingSmall, setloadingSmall] = useState(false);

const [currentPage , setCurrentPage] = useState(1);
const [pagesNumbers , setPagesNumbers] = useState();
const [postsPerPage] = useState(30);
const [indexOfFirstPost, setIndexOfFirstPost] = useState();
const [indexOfLastPost, setIndexOfLastPost] = useState();
const [currentPost, setCurrentPost] = useState([]);
const [search , setSearch] = useState('');

const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');


const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 765px)").matches)
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 765px)").addListener(handler2)},[])

const getData = ()=>{
        const body = {branch:branchname, bransh:bransh, auth:auth}
        axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/qst-processes-2',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
            setData(response.data.result)
            setFilteredData(response.data.result)
            setIndexOfFirstPost((currentPage * postsPerPage)- postsPerPage)
            setIndexOfLastPost(currentPage * postsPerPage)
            setloading(false)
        })
        .catch((err)=>{
            setloading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
}


useEffect(() => { getData(); }, [])
useEffect(() => { getData(); }, [bransh])
const SetBranch = (e)=>{
    const sort = e.target.value;
    setBransh(sort);
    const q = params.get('branch');
    var url = new URL(window.location);
    (url.searchParams.has('branch') ? url.searchParams.set('branch',sort) : url.searchParams.append('branch',sort));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    getData()
}
useEffect(() => {
    setIndexOfFirstPost((currentPage * postsPerPage)- postsPerPage)
    setIndexOfLastPost(currentPage * postsPerPage)
    setCurrentPost(data.slice(indexOfFirstPost,indexOfLastPost))
    setFilteredData(data.slice(indexOfFirstPost,indexOfLastPost))
}, [data,currentPage])

/*--------Pagination--------------*/
const forlop = ()=>{
     const pages_count =  Math.ceil((data.length) / postsPerPage);
     setPagesNumbers(pages_count)
}

useEffect(() => {
   forlop()
},[data])

const handleSteps = (event, value) => {
    setCurrentPage(value)
    setIndexOfFirstPost(((value) * postsPerPage)- postsPerPage)
    setIndexOfLastPost((value) * postsPerPage)
}


/*-------------Handle Search--------------*/
const HandleSearch = (value)=>{setSearch(value)}
useEffect(() => {
    setFilteredData(currentPost);
    const pages_count =  Math.ceil((data.length) / postsPerPage);
    setPagesNumbers(pages_count)
 },[search])

/*-----------Filter data on click search--------------*/
const filterData = () =>{
const lowercasedValue = search.toLowerCase().trim();
    if (lowercasedValue === '') setFilteredData(currentPost);
    else {
        const pages_count =  Math.ceil((data.length) / postsPerPage);
        setPagesNumbers(pages_count)

        setFilteredData(data)
        const filteredData = filtered_data.filter((item) => {
            return Object.keys(item).some((key) => 
            item[key].toString().toLowerCase().includes(lowercasedValue)
            );
        });
        setFilteredData(filteredData);
    }
};


const InquiryInfo =(code)=>{
  history.push(`/qst-loop/${code}`)
}
    return (
        <>
          <div className="Page_Container" id="Page_Container_Qst_data">
                <div className="Page_Header"> 
                    <GoBack/>
                     {!matches1 && <HeaderMenu/>}
                     <div className="Header_word">مستند بيع العملاء</div>
                </div>
                <div className="table_grap">
                {auth != 'admin'  ? '': <BranchFilter bransh={bransh} SetBranch={SetBranch} />}
                <div className="table_search_contents">
                    <div className="search_box">
                            <input className="table_content_search_input" type="text" value={search}  onChange={(e)=>HandleSearch(e.target.value)} placeholder="Search..." />  
                    </div>
                      {search.length > 0 &&
                      <button className="search_btn" id="emptySearchBtn" onClick={()=>{setSearch('')}} >X</button>
                       }
                      <button className="search_btn" onClick={filterData} >بحث</button>
                    <LocalizationProvider locale={localeMap[locale]} dateAdapter={AdapterDateFns}>
                        <MobileDatePicker id="date_picker"  value={date}  onChange={(newValue) => {setDateValue(newValue); setSearch(newValue.toLocaleDateString('en-GB')); filterData(); }} onClick={filterData}
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
                        <th className="table_th">الكود</th>
                        <th className="table_th">الاسم</th>
                        <th className="table_th">الرقم القومي</th>
                        <th className="table_th" id="total_price_th">الاجمالي</th>
                        <th className="table_th" id="rest_price_th">المتبقي</th>
                        <th className="table_th">تاريخ البيعة</th>
                    </tr>
                }
                    {loading ? <div className="spinner_container"><div className="spinner spinner-circle"></div></div> : <>
                    {filtered_data.map((item, i)=>(
                        <tr className="table_tr" key={i} onClick={(e)=>InquiryInfo(item.code)}>  
                            <td className="table_td qst_td"><div className="qst_td_value"> {item.code}</div></td>
                            <td className="table_td qst_td"><div className="qst_td_value"> {item.username}</div></td>
                            <td className="table_td qst_td"><div className="qst_td_value"> {item.nat_id}</div></td>
                            <td className="table_td qst_td" id="total_price_td"><div className="qst_td_value">{item.total_price}</div></td>
                            <td className="table_td qst_td"  id="rest_price_td"><div className="qst_td_value">{item.rest_price}</div></td>
                            <td className="table_td qst_td"><div className="qst_td_value">{item.date}</div></td>
                        </tr>
                    ))} 
                </>}
                </table>
            </div>
            <div className={connect_msg ? "Connect_Dialog_hidden Connect_Dialog_show" : "Connect_Dialog_hidden"}> خطأ في الاتصال بالسيرفر!</div>
        </div>
        <div className="pagination_ul"><Pagination count={pagesNumbers} color="primary" onChange={handleSteps} /></div>
    </>
    )
}
