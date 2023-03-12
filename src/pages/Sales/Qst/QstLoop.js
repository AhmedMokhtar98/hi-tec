import React, { useState,useEffect,useContext } from 'react'
import GoBack from './../../components/Back';
import HeaderMenu from './../../components/HeaderMenu';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import arLocale from "date-fns/locale/ar-EG";
import './css/qst_loop.css';
import  Button  from '@mui/material/Button';
import jwt_decode from "jwt-decode";
const localeMap = {
  ar: arLocale,
};

export default function QstLoop() {
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const [popup, setPopup] = useState(false);

const params = useParams(); 
const [locale] = useState('ar')
const [Data, setData] = useState([])
const [Username, setUsername] = useState('')
const [Code, setCode] = useState(params.code)
const [RestPrice, setRestPrice] = useState(null)
const [Details, setDetails] = useState([])
const [employee, setEmployee] = useState('')
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
       setCode(response.data.result[0].code);
       setRestPrice(response.data.result2[0].rest_price)
    })
}
useEffect(() => {
    getData()
},[])
useEffect(() => {
    getData()
},[employee])


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
    console.log(isInThePast(new Date(Data[index]['date']))); // 👉️ true
    if(isInThePast(new Date(Data[index]['date'])) == true){ // in future 
        if(diff > 5){
            var arrFine = [...Data];
            arrFine[index]['fine'] = 50
            setData(arrFine)
        }
        if(diff < 5){
            var arrFine = [...Data];
            arrFine[index]['fine'] = 0
            setData(arrFine)
        }
    } 
    
    else{// in the past
        if(diff > 5){
            var arrFine = [...Data];
            arrFine[index]['fine'] = 0
            setData(arrFine)
        }
        if(diff < 5){
            var arrFine = [...Data];
            arrFine[index]['fine'] = 0
            setData(arrFine)
        }
    }
   
    function isInThePast(date) {
        const worthdate = Data[index]['worth_date']
        var d1 = new Date(worthdate) //firstDate
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log('rasd',value);
        return value > d1;
    }
}




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
    //console.log('diff',diff / (1000 * 60 * 60 * 24));
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
        const calc = ( Number(RestPrice) + Number(fine) ) - Number(paid)
        const body = {data:row,id:id,restprice:calc,code:Code, branch:branchname}
        axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/collect-qst-2',body,{
            headers:{"x-access-token":localStorage.getItem('token')}
        })
        .then((response)=>{
            setRestPrice(calc)
        })
    }
    else{alert('ٌأكتب البيانات أولا..')}
}






/*-------------------------Leashed--------------------------*/
const InputFocus = (e,index)=>{
    var arr = [...Data];
    if(e.target.value == 0){
        arr[index][e.target.name]=' '
        setData(arr)
    }
}

const PurchaseAll = (e)=>{
    e.preventDefault()
    const body = {date:new Date().toLocaleDateString('fr-CA'), code:Code, paid:Data[0]['premium'], fine:0, notes:'-', employee:employee, status:'true' }
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/purchase-all-2',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    })
    .then((response)=>{
        console.log(response)
        setPopup(false)
        setRestPrice(0)
        setData(current =>
            current.map(obj => {
            if (obj.status === 'false') { return {...obj, status: 'true'};}
            return obj;
            }),
        );
    })
}
    return (
        <div className="Page_Container">
            <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">تحصيل قسط</div>
            </div>
            <div className="Qst_Loop_Container">
                    
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
                            <div className="Qst_loop_Label">الحساب المتبقي</div>
                            <input disabled type="text" value={RestPrice} className="qst_loop_Input"/>
                        </div>
                    </div>
                    
                       <table id="table_id">
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
                            <td className="table_td qst_loop" ><input disabled type="number" name="fine" value={item.fine} onChange={(e)=>HandleChange(e,i)} className="qst_loop_Input" id="fine_input"  style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}}/></td>
                            <td className="table_td qst_loop"><input type="number" name="paid" value={item.paid} onChange={(e)=>HandleChange(e,i)} onFocus={(e)=>InputFocus(e,i)} className="qst_loop_Input" disabled={item.status==="true"?true:false} style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}}/></td>
                            <td className="table_td qst_loop"><input type="text" name="employee" value={item.employee} onChange={(e)=>HandleChange(e,i)} className="qst_loop_Input" disabled={item.status==="true"?true:false} style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}} required/></td>
                            <td className="table_td qst_loop">
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
                            </td>
                            <td className="table_td qst_loop"><input type="text" name="notes" value={item.notes} onChange={(e)=>HandleChange(e,i)} className="qst_loop_Input" disabled={item.status==="true"?true:false} style={{background:item.status ==='true' ? 'rgb(255 255 255 / 64%)':'white' ,color:'black'}} required/></td>
                            <td className="table_td qst_loop">
                                {item.status === 'true'? 
                                <Button disabled variant="outlined" onClick={()=>Submit(i)}>تم</Button>
                                :
                                <>
                                {auth != 'collect' &&
                                    <Button variant="outlined" onClick={()=>Submit(i)}>تسديد</Button>
                                }
                                </>
                                }
                           </td>
                        </tr>
                    ))} 
                </table>
            </div>
            {auth != 'collect' &&
            <>
                {RestPrice > 0 ? 
                <Button id="purchase_all" variant="outlined" onClick={()=>{setPopup(true)}}>تسديد الكل {RestPrice}</Button>
                : 
                <Button id="purchase_all" variant="outlined" style={{background:'grey'}}>تم السداد بالكامل</Button>
                }
                {popup ? 
                <div className="Are_you_sure_delete_container">
                    <div className="Are_you_sure_delete_div">
                        <div className="Are_you_sure_delete_word" >هل انت متأكد من دفع المبلغ ({RestPrice}) جنيها بالكامل  ؟</div>
                    <form onSubmit={PurchaseAll}>
                            التوقيع<input type="text" name="employee" onChange={(e)=>{setEmployee(e.target.value)}} className="purchase_all_employee_input" required/>
                            <button className="handel_delete_btns" id="confirm_delete_btn" type="submit">نعم</button>    
                            <button className="handel_delete_btns" id="cancel_delete_btn" onClick={()=>{setPopup(false)}}>لا</button>
                        </form>
                    </div> 
                </div>
                : 
                ''}
            </>
        }


        </div>
    )
}

