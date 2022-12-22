import React, { useState,useEffect,useContext,useLayoutEffect, useRef  } from 'react'
import GoBack from './../../components/Back';
import HeaderMenu from './../../components/HeaderMenu';
import axios from 'axios';
import '../css/inquiry_info.css';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import ReactToPrint from 'react-to-print';
import {FiPrinter} from 'react-icons/fi'
import  Button  from '@mui/material/Button';

export default function Inquiry_Info() {
const params = useParams(); 
const history = useHistory();
const [branchName]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const[Data,setData] = useState([])
const[ViewData,setViewData] = useState([])
const[garanteeArray,setGA] = useState([])
const[CodesArray,setCodesArray] = useState([])
const[Code,setCode] = useState('')
const[CodeStatus,setCodeStatus] = useState(true)
const[loading,setLoading] = useState(false)
const[success,setSuccess] = useState(false)
const[successMsg,setSuccessMsg] = useState(false)
const inputRef = useRef(null);


const[matches,setMatches] = useState(window.matchMedia("(min-width: 850px)").matches)
useEffect(() => {
    const handler = (e) => setMatches( e.matches );
    window.matchMedia("(min-width: 850px)").addListener(handler);
},[])

useEffect(async() => {
    const body ={ nat_id:params.nat_id, branch:branchName}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/inquery-user-info',body)
    .then((response)=>{
        setViewData(response.data.result[0])
        setData(response.data.result)
    })
    await axios.get('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/codes')
    .then((response)=>{
        setCodesArray(response.data.result)
    })
},[])
useEffect(() => { generateSerial() }, [CodesArray])

const HandleCode = (e)=>{
    setCode(e.target.value)
    if(e.target.value < 0 ){ setCode('') }
}

useEffect(() => {
    const check = CodesArray.some((el)=> el.code == Code )
    setCodeStatus(check)
},[Code,CodeStatus])


const generateSerial = ()=> {
    var chars = '1234567890',
        serialLength = 5,
        randomSerial = "",
        i,
        randomNumber;
    for (i = 0; i < serialLength; i = i + 1) {
        randomNumber = Math.floor(Math.random() * chars.length);
        randomSerial += chars.substring(randomNumber, randomNumber + 1);
    }
    setCode(randomSerial)
}


const Accept = async() =>{
   setLoading(true)
    const result1 = Data.map(({username_1,nickname_1,relationship_1,nat_id_1,address_1,housing_contract_1, service_reciept_1,phone_number_1, job_1,salary_1,work_address_1,nat_id,branch}) => [username_1,nickname_1,relationship_1,nat_id_1,address_1,housing_contract_1, service_reciept_1,phone_number_1, job_1,salary_1,work_address_1,nat_id,branch])
    var arr =  garanteeArray
    arr.push(result1[0])
    if(ViewData.premium > 4500){
        const result2 =  Data.map(({username_2,nickname_2,relationship_2,nat_id_2,address_2,housing_contract_2, service_reciept_2,phone_number_2, job_2,salary_2,work_address_2,nat_id,branch}) => [username_2,nickname_2,relationship_2,nat_id_2,address_2,housing_contract_2, service_reciept_2,phone_number_2, job_2,salary_2,work_address_2,nat_id,branch])
        arr.push(result2[0])
    }

    function FilterUserData(){
    [ 
    'inc','product_name','product_price','premium','period','total_price','prepaid','status','pre_cost','inq_writer','inq_tester',
    'username_1', 'nickname_1', 'relationship_1', 'nat_id_1', 'address_1', 'housing_contract_1', 'service_reciept_1','phone_number_1', 'job_1','salary_1','work_address_1',
    'username_2', 'nickname_2', 'relationship_2', 'nat_id_2', 'address_2', 'housing_contract_2', 'service_reciept_2','phone_number_2', 'job_2','salary_2','work_address_2'
    ].forEach(key => delete ViewData[key])
    return ViewData
    }
    FilterUserData();
       const UserData = Object.assign({"code":Code},FilterUserData())
       const body = {UserData:UserData}
       console.log('body',body);
       const body2 = {Garantees:arr}
       axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/inquiry-confirm-user',body)
      .then((response)=>{
           setSuccessMsg(response.data.success_msg)
           axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/inquiry-confirm-garantee',body2)
           .then((response2)=>{
             setLoading(false)
             setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                }, 1500);
                setTimeout(() => {
                    // history.goBack()
                     history.push(`/inquiries/report/${params.nat_id}`)
                }, 1800);
          })
      })
      //history.push(`/inquiries/report/${params.nat_id}`)
    }


const Delete = ()=>{
   setLoading(true)
   const body = {nat_id:params.nat_id, branch:branchName}
   axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/inquiry-delete`,body)
     .then((response)=>{
          console.log(response)
           setSuccessMsg(response.data.success_msg)
            setLoading(false)
             setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                }, 1500);
                  setTimeout(() => {
                    // history.goBack()
                    history.push(`/inquiries/report/${params.nat_id}`)
                }, 1800);
     })
}

const AddToProblems =()=>{
    if(ViewData.issues ==='x'){alert('العميل مضاف بالفعل الي القضايا')}
    else{
        const body = {nat_id:params.nat_id}
        axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/set_issues`,body,{
            headers:{"x-access-token":localStorage.getItem('token')}
        })
        .then((response)=>{
            setViewData({...ViewData, issues:'x'})
            alert('تم أضافة العميل الي صفحة القضايا')
        })
    }
}
    return (
          <div className="Page_Container">
                <div className="Page_Header"> 
                    <GoBack/>
                    {! matches && <HeaderMenu/>}
                    <div className="Header_word">بيان استعلام</div>
                 </div>
                <Button className="Problems_buttons"  style={{background:ViewData.issues ==='x' ? 'grey' : 'red'}} variant="contained" onClick={()=>AddToProblems()}>اضافة الي القضايا</Button>
                <div className="inquiry_info_container" ref={inputRef}>
                <ReactToPrint   bodyClass="printing" trigger={() => { return <button className="print_button"><FiPrinter/> طباعة</button>; }} content={() => inputRef.current} pageStyle="print" documentTitle="بيان استعلام" />
                  <div className="inquiry_info_user_select">
                    <div className="inquiry_info_Sections" id="inquiry_info_sections">

                        <div className="Sections__Rows">
                        <label className="label_inquiry_">المراجع</label>
                            <div>{ViewData.inq_tester}</div>
                            <label className="label_inquiry_">كاتب الاستعلام</label>
                            <div>{ViewData.inq_writer}</div>
                            <h3 className="inquiry_section_headers">بيانات العميل</h3>
                            <div className="Section_splite_row_qst">
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">اسم العميل</label>
                                    <input type="text" name="username" value={ViewData.username} className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">الشهرة </label>
                                    <input type="text" name="nickname" value={ViewData.nickname} className="inquiry_Inputt" />
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> رقم البطاقة</label>
                                    <input type="text" name="nat_id" value={ViewData.nat_id} className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> العنوان</label>
                                    <input type="text" name="address" value={ViewData.address} className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> عقد السكن</label>
                                    <input type="text" name="housing_contract" value={ViewData.housing_contract} className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> ايصال الخدمة</label>
                                    <input type="text" name="service_reciept" value={ViewData.service_reciept}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> التليفون</label>
                                    <input type="text" name="phone_number" value={ViewData.phone_number} className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> الوظيفة</label>
                                    <input type="text" name="job" value={ViewData.job} className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> اجمالي الدخل</label>
                                    <input type="text" name="salary" value={ViewData.salary} className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> عنوان العمل</label>
                                    <input type="text" name="work_address" value={ViewData.work_address}  className="inquiry_Inputt"/>
                                </div>
                            </div>
                        </div>


                        {/*--------------------------1 بيانات الضامن--------------------------*/}
                        <div className="Sections__Rows">
                            <h3 className="inquiry_section_headers">بيانات الضامن</h3>
                            <div className="Section_splite_row_qst">
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">اسم العميل</label>
                                    <input type="text" name="username_1" value={ViewData.username_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">الشهرة </label>
                                    <input type="text" name="nickname_1" value={ViewData.nickname_1}  className="inquiry_Inputt" />
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">القرابة </label>
                                    <input type="text" name="relationship_1" value={ViewData.relationship_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> رقم البطاقة</label>
                                    <input type="text" name="nat_id_1" value={ViewData.nat_id_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> العنوان</label>
                                    <input type="text" name="address_1" value={ViewData.address_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> عقد السكن</label>
                                    <input type="text" name="housing_contract_1" value={ViewData.housing_contract_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> ايصال الخدمة</label>
                                    <input type="text" name="service_reciept_1" value={ViewData.service_reciept_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> التليفون</label>
                                    <input type="text" name="phone_number_1" value={ViewData.phone_number_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> الوظيفة</label>
                                    <input type="text" name="job_1" value={ViewData.job_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> اجمالي الدخل</label>
                                    <input type="text" name="salary_1" value={ViewData.salary_1}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> عنوان العمل</label>
                                    <input type="text" name="work_address_1" value={ViewData.work_address_1}  className="inquiry_Inputt"/>
                                </div>
                            </div>
                        </div>


                        {/*--------------------------2 بيانات الضامن--------------------------*/}
                        {ViewData.premium > 8000 &&
                        <div className="Sections__Rows">
                            <h3 className="inquiry_section_headers"> بيانات الضامن الثاني</h3>
                            <div className="Section_splite_row_qst">
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">اسم العميل</label>
                                    <input type="text" name="username_2" value={ViewData.username_2}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">الشهرة </label>
                                    <input type="text" name="nickname_2" value={ViewData.nickname_2}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">القرابة </label>
                                    <input type="text" name="relationship_2" value={ViewData.relationship_2}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> رقم البطاقة</label>
                                    <input type="text" name="nat_id_2" value={ViewData.nat_id_2}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> العنوان</label>
                                    <input type="text" name="address_2" value={ViewData.address_2}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> عقد السكن</label>
                                    <input type="text" name="housing_contract_2" value={ViewData.housing_contract_2}  className="inquiry_Inputt" />
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> ايصال الخدمة</label>
                                    <input type="text" name="service_reciept_2" value={ViewData.service_reciept_2} className="inquiry_Inputt" />
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> التليفون</label>
                                    <input type="text" name="phone_number_2" value={ViewData.phone_number_2}  className="inquiry_Inputt" />
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> الوظيفة</label>
                                    <input type="text" name="job_2" value={ViewData.job_2} className="inquiry_Inputt" />
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> اجمالي الدخل</label>
                                    <input type="text" name="salary_2" value={ViewData.salary_2}  className="inquiry_Inputt" />
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_"> عنوان العمل</label>
                                    <input type="text" name="work_address_2" value={ViewData.work_address_2}  className="inquiry_Inputt" />
                                </div>
                            </div>
                        </div>
                        }

                        {/*--------------------------ءبيانات الدفع--------------------------*/}
                        <div className="Sections__Rows">
                            <h3 className="inquiry_section_headers">بيانات الدفع</h3>
                            <div className="Section_splite_row_qst">
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">اسم المنتج</label>
                                    <input type="text" name="product_name" value={ViewData.product_name}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">سعر المنتج </label>
                                    <input type="number" name="product_price" value={ViewData.product_price} className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">المقدم </label>
                                    <input type="number" name="prepaid" value={ViewData.prepaid}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry">
                                    <label className="label_inquiry_">القسط</label>
                                    <input style={{background:'rgb(201 201 201 / 32%)'}} type="number" name="premium" value={ViewData.premium} className="inquiry_Inputt" id ="specific_colored"  />
                                </div>
                                <div className="Input_Section_inquiry Select_Section_qst">
                                    <label className="label_inquiry_">المدة</label>
                                     <input type="number" name="prepaid" value={ViewData.period}  className="inquiry_Inputt"/>
                                </div>
                                <div className="Input_Section_inquiry" id="Total_qst_price">
                                    <label className="label_inquiry_">الاجمالي</label>
                                    <input disabled type="number" value={ViewData.total_price} id="Total_qst_price_input"/>
                                </div>
                            </div>
                        </div>
                        {/*-------------------------- حفظ --------------------------*/}
                        <div className="Code_menu">
                            <div className="clientCode_header">كود العميل</div>
                            <button onClick={()=>generateSerial()} className="AutoCodeBtn">تلقائي</button>
                            <input type="text" value={Code} onChange={(e)=>HandleCode(e)} style={{background:CodeStatus?'rgb(255 75 75 / 52%)':'white'}} className="CodeInput"/>
                        </div>
                    </div>
             
                </div>
            </div>
            <div className="inquiry_bottom_btns_div">
                {ViewData.status === 'pending' ||  'rejected' ? 
                <>
                {CodeStatus ?
                <button disabled className="inquiry_bottom_btn" style={{background:'lightgrey'}}>تأكيد</button>
                : 
                <button onClick={()=>Accept()} className="inquiry_bottom_btn">تأكيد</button>
                }
                </>
                : ''}
                <>
                {ViewData.status != 'rejected' ? <button onClick={()=> Delete()} className="inquiry_bottom_btn" id="Delete_inquiry_btnn">حذف</button> : '' }
                </>
                
            </div>
            {loading ? 
                    <div id="Loading_Dialog_fixed">
                        <div className="spinner_container">
                            <div className="spinner spinner-circle"></div>
                        </div> 
                    </div>
                : ''}
            <div className={success ? "Success_Dialog_hidden_fixed Success_Dialog_show_fixed" : "Success_Dialog_hidden_fixed"}>{successMsg}</div>
        </div>
    )
}
