import React, { useState,useEffect,useContext } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import arLocale from "date-fns/locale/ar-EG";
import './rate.css';
import './tables.css'
import  Button  from '@mui/material/Button';
import jwt_decode from "jwt-decode";
import GoBack from './../../../pages/components/Back';
import HeaderMenu from './../../../pages/components/HeaderMenu';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

const localeMap = {
  ar: arLocale,
};
const labels = {
    1: 'سئ',
    2: 'مقبول',
    3: 'جيد',
    4: 'جيد جدا',
    5: 'ممتاز',
};


export default function Rate() {
const [value, setValue] = useState(1);
const [hover, setHover] = useState(-1);

const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const [popup, setPopup] = useState(false);

const params = useParams(); 
const [locale] = useState('ar')
const [Data, setData] = useState([])
const [Username, setUsername] = useState('')
const [nat_id, setNat_id] = useState(null)
const [total_price, setTotalPrice] = useState(null)
const [product_name, setProductName] = useState('')
const [Code, setCode] = useState(params.code)
const [RestPrice, setRestPrice] = useState(null)
const [Details, setDetails] = useState([])
const [employee, setEmployee] = useState('')
const [fines, setFines] = useState(0)
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 765px)").matches)
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1)},[])
useEffect(() => {const handler2 = (e) => setMatches2( e.matches ); window.matchMedia("(min-width: 765px)").addListener(handler2)},[])

const getData = async()=>{
    const body = {branch:branchname, code:Code, auth:auth}
    await axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/qst-loop-2`,body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        console.log(response.data.result);
       setData(response.data.result);
       setUsername(response.data.result[0].username);
       setNat_id(response.data.result[0].nat_id);
       setProductName(response.data.result2[0].product_name);
       setTotalPrice(response.data.result2[0].total_price);
       setCode(response.data.result[0].code);
       setRestPrice(response.data.result2[0].rest_price)
    })
}

const getFines = ()=>{
    const body = { code:Code}
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/get-qst-process-fines-2',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        setFines(response.data.result[0].count)
    })
}

/*-------------------------Leashed--------------------------*/
const RateValue = (e)=>{
    if(e.target.value == 1){setValue(1)}
    else if(e.target.value == 2){setValue(2)}
    else if(e.target.value == 3){setValue(3)}
    else if(e.target.value == 4){setValue(4)}
    else if(e.target.value == 5){setValue(5)}
}
function getLabelText(value) {
    return `${fines} Star${fines !== 1 ? 's' : ''}, ${labels[fines]}`;
}


const GetRate = ()=>{
    const body = {nat_id:nat_id}
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/get-rate-2',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
     console.log(response);
     setValue(response.data.result[0].rate)
    })
}

const SubmitRate = ()=>{
    const body = {rate:value,nat_id:nat_id}
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/rate-user-2',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
     console.log(response);
     alert('تم التقييم')
    })
}
useEffect(() => {   getData() },[])
useEffect(() => {   getFines() },[Code])
useEffect(() => {   GetRate() },[nat_id])
    return (
            <div className="Page_Container_Rate">
                <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">تقييم العميل</div>
            </div>
                    
                    <div className="Qst_Loop_UserInfo">
                        <div className="Qst_Loop_UserInfo_li">
                            <div className="Qst_loop_Label">الاسم</div>
                            <input disabled type="text" value={Username} className="qst_loop_Input"/>
                        </div>
                        <div className="Qst_Loop_UserInfo_li">
                            <div className="Qst_loop_Label">الكود</div>
                            <input disabled type="text" value={Code} className="qst_loop_Input"/>
                        </div>
                
                        <div className="Qst_Loop_UserInfo_li">
                            <div className="Qst_loop_Label">المنتج</div>
                            <input disabled type="text" value={product_name} className="qst_loop_Input"/>
                        </div>
                        <div className="Qst_Loop_UserInfo_li">
                            <div className="Qst_loop_Label">الاجمالي</div>
                            <input disabled type="text" value={total_price} className="qst_loop_Input"/>
                        </div>
                        <div className="Qst_Loop_UserInfo_li">
                            <div className="Qst_loop_Label">الحساب المتبقي</div>
                            <input disabled type="text" value={RestPrice} className="qst_loop_Input"/>
                        </div>
                    </div>
                    
                    <div className="table_grap_rate" >
                       <table id="table_id" style={{direction: "rtl", width: "100%"}}>
                            {matches2 &&
                            <tr className="table_tr_head">
                                <th className="table_th"> </th>
                                <th className="table_th">تاريخ الاستحقاق</th>
                                <th className="table_th">القسط</th>
                                <th className="table_th">غ</th>
                                <th className="table_th">المدفوع</th>
                                <th className="table_th">المحصل</th>
                                <th className="table_th">تاريخ السداد</th>
                                <th className="table_th">الملاحظات</th>
                                <th className="table_th"></th>
                            </tr>
                            }

                            {Data.map((item, i)=>(
                                <tr className="table_tr" style={{background:item.status ==='true' ? 'rgb(51 255 0 / 9%)':'white'}} key={i+1}  >  
                                    <td className="table_td qst_loop"> {i+1}</td>
                                    <td className="table_td qst_loop" id="worth_date_td" style={{color:item.status ==='true' ? 'green':'rgb(233 30 99)'}}> {item.worth_date}</td>
                                    <td className="table_td qst_loop"> {item.premium}</td>
                                    <td className="table_td qst_loop" ><input disabled type="number" name="fine" value={item.fine} className="qst_loop_Input" id="fine_input"  style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}}/></td>
                                    <td className="table_td qst_loop"><input type="number" name="paid" value={item.paid}  className="qst_loop_Input" disabled={item.status==="true"?true:false} style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}}/></td>
                                    <td className="table_td qst_loop"><input type="text" name="employee" value={item.employee} className="qst_loop_Input" disabled={item.status==="true"?true:false} style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}} required/></td>
                                    <td className="table_td qst_loop">
                                    <LocalizationProvider locale={localeMap[locale]} dateAdapter={AdapterDateFns}>
                                        <MobileDatePicker inputFormat="yyyy/MM/d" id="date_picker"  value={item.date}  
                                        renderInput={(params) =>
                                        <div ref={params.InputProps.ref} className="add_inquiry_DatePickerIcon">
                                            <label {...params.InputLabelProps} > 
                                                <input type="text" value={item.date} {...params.inputProps}  className="qst_loop_Input" disabled={item.status==="true"?true:false} style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}} placeholder="اختر التاريخ" required/>
                                            </label>
                                        </div>
                                        }/>
                                    </LocalizationProvider>
                                    </td>
                                    <td className="table_td qst_loop"><input type="text" name="notes" value={item.notes} className="qst_loop_Input" disabled={item.status==="true"?true:false} style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}} required/></td>
                                    <td className="table_td qst_loop"><Button disabled variant="outlined" >تم</Button> </td>
                                </tr>
                            ))} 
                        </table>
                    <div  className="Rate_banner">
                        <div className="banner_card_div" id="fines_card" >
                            <div>عدد الغرامات</div>
                            <div className="rating_section">{fines}</div>
                        </div> 
                        <div className="banner_card_div" id="ratecondition_card">
                            <div>حالة العميل</div>
                            <div className="rating_section">{(value == 0) ? 'لم يتم التقييم بعد' :   ( value == 1) ? 'سئ' : ( value ==2) ? 'مقبول' : ( value == 3) ? 'جيد ' : (value == 4 ) ? 'جيد جدا' : (value == 5) && 'ممتاز'}</div>
                        </div>
                        <Box  sx={{width: 200, display: 'flex', alignItems: 'center'}} >
                                <Rating name="hover-feedback" value={value} precision={1} getLabelText={(e)=>getLabelText(fines)} onChange={(e)=> { RateValue(e) }} onChangeActive={(event, newHover) => { setHover(newHover); }}  style={{direction: "ltr"}}/>
                                {value !== null && ( <Box sx={{ ml: 2, }} >  {labels[hover !== -1 ? hover : value]} </Box> )}
                        </Box> 
                        <Button onClick={SubmitRate} variant='outlined' className="user_rate_btn">تقييم</Button>

                    </div>

                       
                         
     </div>
            </div>

    )
}

