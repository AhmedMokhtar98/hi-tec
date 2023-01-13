import React, { useState,useEffect,useContext } from 'react'
import axios from 'axios';
import HeaderMenu from './../components/HeaderMenu';
import './css/collect.css'
import  Button  from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import arLocale from "date-fns/locale/ar-EG";
import GoBack from './../components/Back';
import jwt_decode from "jwt-decode";
import BranchFilter from './../components/BranchFilter';
const localeMap = {
  ar: arLocale,
};


export default function Collect() {
const[locale] = useState('ar')
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const[loading, setLoading] = useState(false)
const [date, setDateValue] = React.useState(new Date());
const [SearchType, setSearchType] = useState('date');
const [search , setSearch] = useState(new Date().toLocaleDateString('fr-CA'));
//const [search , setSearch] = useState('');
const [TodayDate] = useState(new Date().toLocaleDateString('fr-CA'))
const [Data, setData] = useState([])
const [Code, setCode] = useState('')
const [RestPrice, setRestPrice] = useState(null)
const [OverallPrice, setOverallPrice] = useState(null)
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 760px)").matches)

const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');

const HandleChange = (e,index)=>{
    var arr = [...Data]
    arr[index][e.target.name]=e.target.value
    setData(arr)
    console.log(Data)
    const worthdate = Data[index]['worth_date']
    const date = Data[index]['date']

    var d1 = new Date(worthdate) //firstDate
    var d2 = new Date(date) //SecondDate
    var diff = Math.abs(d1-d2); //in milliseconds
    console.log('diff',diff / (1000 * 60 * 60 * 24));
}



const HandleDate = (value,index)=>{
    var arr = [...Data];
    arr[index]['date'] = value.toLocaleDateString('fr-CA');
    setData(arr)

    const worthdate = Data[index]['worth_date']
    const date = Data[index]['date']
    var d1 = new Date(worthdate) //firstDate
    var d2 = new Date(date) //SecondDate
    var calculate = Math.abs(d1-d2); //in milliseconds
    const diff = calculate / (1000 * 60 * 60 * 24)
    console.log('diff',diff);
    if(diff > 2){
        var arrFine = [...Data];
        arrFine[index]['fine'] = 50
        setData(arrFine)
    }
    if(diff < 2){
        var arrFine = [...Data];
        arrFine[index]['fine'] = 0
        setData(arrFine)
    }
}


const Submit = (index)=>{
    var upStatus = Data[index]
    
    const row = upStatus

    const id = row.id;
    const paid = row.paid;
    const fine = row.fine;
    const date = row.date;
    const employee = row.employee;
    const notes = row.notes;
    const status = row.status;
    if(paid > 0 && employee.length > 0 && date.length > 0){
    upStatus.status = 'true'
        var upData = [...Data];
        upData[index] = row
        setData(upData);
       // const newArray = row.map(({restprice, ...keepAttrs}) => keepAttrs)
       let state = {...row};
       delete state.rest_price;
        console.log('state',state)
        const calc = ( Number(RestPrice) + Number(fine) ) - Number(paid)
        const body = {data:state, id:id, restprice:calc, code:Code, branch:branchname}
        axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/collect-qst-2',body,{
            headers:{"x-access-token":localStorage.getItem('token')}
        })
        .then((response)=>{
            console.log(response)
            setRestPrice(calc)
        })
    }
    else{alert('ٌأكتب البيانات أولا..')}
}




/*------------------------------------------*/
const selectSearchType = (e)=>{
    setSearchType(e.target.value)
}
const HandleSearch = (value)=>{setSearch(value)}

const SubmitSearch = async()=>{

    setLoading(true)
        const data = {search:search,type:SearchType, branch:branchname, bransh:bransh, auth:auth}
        await axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/qst-collect-today-2`,data,{
            headers:{"x-access-token":localStorage.getItem('token')}
            }).then((response)=>{
            setData(response.data.result);
            setLoading(false)
            setRestPrice(response.data.result[0].rest_price)
            const length = response.data.result.length
            const data = response.data.result
            var total = 0
            for(var i=0;i<length;i++){
                total = total + data[i]['paid']
            setOverallPrice(total)
            }
        })
}

useEffect(() => { SubmitSearch() }, [])
useEffect(()=>{ SubmitSearch() },[bransh])

const SetBranch = (e)=>{
    setLoading(true)
    const sort = e.target.value;
    setBransh(sort);
    const q = params.get('branch');
    var url = new URL(window.location);
    (url.searchParams.has('branch') ? url.searchParams.set('branch',sort) : url.searchParams.append('branch',sort));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    SubmitSearch()
}

/*-------------------------Leashed--------------------------*/
const InputFocus = (e,index)=>{
    if(e.target.value == 0){
        var arr = [...Data];
        arr[index][e.target.name]=''
        setData(arr)
    }
}

/*-------------------------Leashed--------------------------*/
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 760px)").addListener(handler2)},[])

    return (
        <div className="Page_Container">
        <div className="Page_Header"> 
            <GoBack/>
            {!matches1 && <HeaderMenu/>}
            <div className="Header_word">دفتر التحصيل</div>
        </div>
        {auth != 'admin'  ? '': <BranchFilter bransh={bransh} SetBranch={SetBranch} />}
         <div className="table_search_contents">
                <div className="users_search_box">
                        <input className="table_content_search_input" type="text" value={search}   onChange={(e)=>HandleSearch(e.target.value)} placeholder="Search..." /*disabled={SearchType=='date'?true:false}*//>  
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
                    <MobileDatePicker id="add_cash_date_picker"  value={date}  onChange={(newValue) => {setDateValue(newValue); setSearchType('date'); setSearch(newValue.toLocaleDateString('fr-CA')); SubmitSearch(); }} onClick={SubmitSearch}
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
                    <th className="table_th" ></th>
                    <th className="table_th" id="home_premium_th">القسط</th>
                    <th className="table_th">اسم العميل</th>
                    <th className="table_th">الكود</th>
                    <th className="table_th">تاريخ الاستحقاق</th>
                    <th className="table_th">تاريخ الدفع</th>
                    <th className="table_th">غ</th>
                    <th className="table_th">المدفوع</th>
                    <th className="table_th">المحصل</th>
                    <th className="table_th">الملاحظات</th>
                    <th className="table_th">الحالة</th>
                </tr>
            }
            {loading ? <div className="spinner_container"><div className="spinner spinner-circle"></div></div> :
            <>
                {Data.length>0 ? 
                <>
                {Data.map((item, i)=>(
                    <tr className="table_tr"  key={i+1}  >  
                        <td className="home_table_td" > {i+1}</td>
                        <td className="home_table_td" id="home_premium_td"><div className="td_div_home_table">{item.premium}</div></td>
                        <td className="home_table_td" id="home_username_td" style={{color:item.status ==='true' ? 'green':'rgb(1 1 1)'}}><div className="td_div_home_table">{item.username}</div></td>
                        <td className="home_table_td"><div className="td_div_home_table">{item.code}</div></td>
                        <td className="home_table_td"><div className="td_div_home_table">{item.worth_date}</div></td>
                        <td className="home_table_td">
                            {item.status==="true"? <div className="td_div_home_table">{item.date}</div> : 
                            <LocalizationProvider locale={localeMap[locale]} dateAdapter={AdapterDateFns}>
                            <MobileDatePicker inputFormat="yyyy/MM/d" id="date_picker"  value={item.date}  onChange={(newValue) => HandleDate(newValue,i)}
                            renderInput={(params) =>
                            <div ref={params.InputProps.ref} className="add_inquiry_DatePickerIcon">
                                <label {...params.InputLabelProps} > 
                                    <input type="text" value={item.date} {...params.inputProps}  className="qst_loop_Input" disabled={item.status==="true"?true:false} style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}} placeholder="اختر التاريخ" required/>
                                </label>
                            </div>
                            }/>
                        </LocalizationProvider>
                            }
                        </td>
                        <td className="home_table_td">{item.status==="true"? <div className="td_div_home_table">{item.fine}</div> : <input type="number" name="fine" value={item.fine} onChange={(e)=>HandleChange(e,i)}  className="home_table_Input"   id="fine_input_home"/>}</td>
                        <td className="home_table_td">{item.status==="true"? <div className="td_div_home_table">{item.paid}</div> : <input type="number" name="paid" value={item.paid} onChange={(e)=>HandleChange(e,i)} onFocus={(e)=>InputFocus(e,i)} className="home_table_Input"  required/>}</td>
                        <td className="home_table_td">{item.status==="true"? <div className="td_div_home_table">{item.employee}</div> : <input type="text" name="employee" value={item.employee} onChange={(e)=>HandleChange(e,i)} className="home_table_Input" required/>}</td>
                        <td className="home_table_td">{item.status==="true"? <div className="td_div_home_table">{item.notes}</div> : <input type="text" name="notes" value={item.notes} onChange={(e)=>HandleChange(e,i)} className="home_table_Input"  />}</td>
                        <td className="home_table_td">
                            {item.status === 'true'? 
                            <Button disabled variant="outlined" onClick={()=>Submit(i)}>تم</Button>
                            :
                            <Button variant="outlined" onClick={()=>Submit(i)}>تسديد</Button>
                            }
                        </td>
                    </tr>
                ))}
                </>
                : <div className="No_Data_Syntax">لا توجد بيانات</div>} 
            </>
            } 

            
            </table>
                <div className={OverallPrice > 0 ?"Total__collect Total__collect_show":"Total__collect Total__collect_hide"}>
                    <div className="Total__li Total__li_total"> الاجمالي /</div>
                    <div className="Total__li Total__li_overall">{OverallPrice} جنية</div>
                </div>
            </div>
    )
}

