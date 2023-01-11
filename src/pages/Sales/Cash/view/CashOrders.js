import React ,{useState,useEffect}from 'react'
import axios from 'axios';
import { BsTrash} from 'react-icons/bs'
import {BiEdit} from 'react-icons/bi'
import {MdOutlineDateRange} from 'react-icons/md'
import '../css/cash_orders.css'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import arLocale from "date-fns/locale/ar-EG";
import Pagination from '@mui/material/Pagination';
import { data as Data} from './../../../../Context/Context';
import GoBack from './../../../components/Back';
import HeaderMenu from './../../../components/HeaderMenu';
import { useHistory } from 'react-router-dom';
import Button  from '@mui/material/Button';
import jwt_decode from "jwt-decode";
import BranchFilter from './../../../components/BranchFilter';
const localeMap = {
    ar: arLocale,
  };
  
export default function CashOrders() {
const history = useHistory()
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const [date, setDateValue] = React.useState(new Date());
const [locale, setLocale] = React.useState('en');
const [data, setData] = useState([]);
const [filtered_data, setFilteredData] = useState([]);
const [loading, setloading] = useState(true);
const [loadingSmall, setloadingSmall] = useState(false);
const [selectedUsers, setSelectedUsers] = useState([]);
const [isCheckAll, setIsCheckAll] = useState(false);
const [currentPage , setCurrentPage] = useState(1);
const [pagesNumbers , setPagesNumbers] = useState();
const [postsPerPage] = useState(30);
const [indexOfFirstPost, setIndexOfFirstPost] = useState();
const [indexOfLastPost, setIndexOfLastPost] = useState();
const [currentPost, setCurrentPost] = useState([]);
const [search , setSearch] = useState('');
const [popup, setPopup] = useState({ show: false, multiple:false,id: null});
const[connect_msg, setConnectMsg]=useState(false)


const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');

const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 760px)").matches)
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 760px)").addListener(handler2)},[])

const getCashOrders = async()=>{
    if(auth != 'admin'){
        const body = {branch:branchname}
        await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/cash-orders',body,{
            headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
            setData(response.data.orders)
            setFilteredData(response.data.orders)
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
    else{
        const body = {branch:bransh}
        await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-cash-orders',body,{
            headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
            setData(response.data.orders)
            setFilteredData(response.data.orders)
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
}

useEffect(()=>{ getCashOrders() },[])
useEffect(()=>{ getCashOrders() },[bransh])

const SetBranch = (e)=>{
    const sort = e.target.value;
    setBransh(sort);
    const q = params.get('branch');
    var url = new URL(window.location);
    (url.searchParams.has('branch') ? url.searchParams.set('branch',sort) : url.searchParams.append('branch',sort));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    getCashOrders()
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

/*----------------- U S E R S  S E L E C T --------------------*/
const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setSelectedUsers(data.map((li) => li.process_id));
    if (isCheckAll) { setSelectedUsers([]);}
};

  const handleSelect = (process_id) => {
    let newArray = [...selectedUsers, process_id];
    if (selectedUsers.includes(process_id)) {
        newArray = newArray.filter((process) => process !== process_id);
      }
    setSelectedUsers(newArray)
  };

/*--------Delete Popup confirm-----------*/
const deleteAlertHandle = (id)=>{  setPopup({show:true, multiple:false, id:id })  }
const deleteMultipleAlertHandle = ()=>{ setPopup({show:true, multiple:true,id:null}) }
/*---------Delete User------------*/
const DeleteOrder = ()=>{
  setloadingSmall(true)
  if(popup.show){
    const body = {process_id:popup.id}
    console.log(body);
    axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/delete_cash_order`,body,
    {headers:{'x-access-token':localStorage.getItem('token')}})
    .then((response)=>{
        setData(data.filter((val)=>{
            return val.process_id != popup.id
        }))
        setloadingSmall(false)
        setPopup({show:false, multiple:false, id:null})
    })
}
}
/*---------Delete multiple Processes------------*/

const DeleteMultiUsers = (e)=>{
    e.preventDefault()
    setloadingSmall(true)
    const body = {ids:selectedUsers}
    axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/delete_multi_cash_order`,body,
    {headers:{'x-access-token':localStorage.getItem('token')}})
    .then((response)=>{
        setData(data.filter((val)=>{
            return  !selectedUsers.includes(val.process_id)
        }))
        setloadingSmall(false)
        setPopup({show:false,id:null,multiple:false})
        setSelectedUsers([])
        setIsCheckAll(false);
    })
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
}

    return (
        <>
       <div className="Page_Container">
            <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">فواتير نقدي</div>
            </div>
            <div className="table_grap">
                <div className="table_header_flex">
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
                        <MobileDatePicker id="add_cash_date_picker"  value={date}  onChange={(newValue) => {setDateValue(newValue); setSearch(newValue.toLocaleDateString('fr-CA')); filterData(); }} onClick={filterData}
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
                        <th className="table_th"><label className="check_box_container"><input type="checkbox" onChange={handleSelectAll} isChecked={isCheckAll} checked={isCheckAll == true ? true : false}  id="selectAll" /> <span className="checkmark"></span></label></th>
                        <th className="table_th">اسم المعرض</th>
                        <th className="table_th">اسم العميل</th>
                        <th className="table_th"> رقم العميل</th>
                        <th className="table_th">اجمالي المشتريات</th>
                        <th className="table_th">تاريخ الشراء</th>
                        <th className="table_th"></th>
                        <th className="table_th">حذف</th>
                    </tr>
                }
                    {loading ? <div className="spinner_container"><div className="spinner spinner-circle"></div></div> : <>
                    {filtered_data.map((item, i)=>(
                    <tr className="table_tr" key={i}>             
                        <td className="table_td cashes_td"><label className="check_box_container"><input onChange={()=>handleSelect(item.process_id)} checked={selectedUsers.includes(item.process_id)} type="checkbox" className="users_checkbox" /><span className="checkmark"></span></label></td>
                        <td className="table_td cashes_td"><div className="cashes_td_value">{item.branch}</div></td>
                        <td className="table_td cashes_td"><div className="cashes_td_value"> {item.username}</div></td>
                        <td className="table_td cashes_td"><div className="cashes_td_value"> {item.phone_number}</div></td>
                        <td className="table_td cashes_td"><div className="cashes_td_value">{item.overall_price}</div></td>
                        <td className="table_td cashes_td"><div className="cashes_td_value"> {item.date}</div></td>
                        <td className="table_td cashes_td"><div className="cashes_td_value"  onClick={(e)=>history.push(`/cash-orders/${item.nat_id}/${item.date}`)}><Button variant="contained" className="cash_orders_buttin">عرض</Button></div></td>
                        <td className="table_td cashes_td"><div className="cashes_td_value"  onClick={(e) =>deleteAlertHandle(item.process_id)}><Button variant="contained" className="cash_orders_buttin_delete" ><BsTrash id="users_delete_btn"/> </Button></div></td>
                    </tr>
                    ))} 
                </>}
                </table>
             
                <div className="users_delete_all_btn_div">
                        {selectedUsers.length > 0 ? <button onClick={deleteMultipleAlertHandle} type="submit" className="users_delete_all_btn">Delete</button> : ''}    
                </div>
            </div>

            <div className={connect_msg ? "Connect_Dialog_hidden Connect_Dialog_show" : "Connect_Dialog_hidden"}> خطأ في الاتصال بالسيرفر!</div>

            </div>
        </div>
        
           
         {popup.show ? 
            <div className="Are_you_sure_delete_container">
                <div className="Are_you_sure_delete_div">
                {loadingSmall ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                    <>
                        <div className="Are_you_sure_delete_word" >هل انت متأكد من حذف الملف ?</div>
                    {popup.multiple ? <button className="handel_delete_btns" id="confirm_delete_btn" onClick={DeleteMultiUsers}>حذف الكل</button> : <button className="handel_delete_btns" id="confirm_delete_btn" onClick={DeleteOrder}>نعم</button> }    
                    <button className="handel_delete_btns" id="cancel_delete_btn" onClick={()=>setPopup({show:false,id:null})}>لا</button>
                    </>
                 }
                </div> 
            </div>
            : ''}

            <div className="pagination_ul"><Pagination count={pagesNumbers} color="primary" onChange={handleSteps} /></div>
  </>
    )
}
