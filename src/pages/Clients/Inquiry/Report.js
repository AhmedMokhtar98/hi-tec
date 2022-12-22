import React, { useState,useEffect,useContext,useLayoutEffect, useRef  } from 'react'
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import GoBack from './../../components/Back';
import HeaderMenu from './../../components/HeaderMenu';
import jwt_decode from "jwt-decode";
import ReactToPrint from 'react-to-print';
import {FiPrinter} from 'react-icons/fi'
import './report.css'
import axios from 'axios';


export default function Report() {
const history = useHistory();
const inputRef = useRef(null);
const[data, setData]=useState({
    address_check:'',
    neighbors_opinion:'',
    financial_condition:'',
    income:'',
    salary_average:0,
    relationship:'',
    sons:'',
    debit:'',
    debit_range:'',
    final_report:'',
    
    g_address_check:'',
    g_neighbors_opinion:'',
    g_financial_condition:'',
    g_income:'',
    g_salary_average:0,
    g_relationship:'',
    g_sons:'',
    g_debit:'',
    g_debit_range:'',
    g_final_report:''
    })
const params = useParams(); 
const [branchName]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const[loading,setLoading] = useState(false)
const[success,setSuccess] = useState(false)
const[successMsg,setSuccessMsg] = useState(false)
const[matches,setMatches] = useState(window.matchMedia("(min-width: 850px)").matches)

const HandleChange = (e)=>{
    const x = data
    x[e.target.name] = e.target.value
    setData(x)
    console.log(data);
}



const Accept = ()=>{
    setLoading(true)
    const x = {...data, 'nat_id':params.nat_id, 'branch':branchName}
    console.log(x);
    const body = {data:x}
    axios.post(`http://localhost:8080/api/upload_report`,body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    })
    .then((response)=>{
        setLoading(false)
        setSuccessMsg(response.data.success_msg)
        setSuccess(true)
        setTimeout(() => {
            setSuccess(false)
        }, 1500);
        setTimeout(() => {
                history.push(`/inquiries`)
        }, 1800);
    })
}

  return (
    <div className="Page_Container">
        <div className="Page_Header"> 
            <GoBack/>
            {! matches && <HeaderMenu/>}
            <div className="Header_word">تقرير استعلام</div>
        </div>
        <ReactToPrint   bodyClass="printing" trigger={() => { return <button className="print_button"><FiPrinter/> طباعة</button>; }} content={() => inputRef.current} pageStyle="print" documentTitle="تقرير استعلام" />
        <div className="inquiry_info_container"  ref={inputRef}>

        <div className="report_rows_container">المشتري

                <div>
                    <div className="report_row">
                    <div className="report_label"> بعد المعاينة للتاكد من عنوان المشتري اتضح ان العنوان : </div>
                        <label><input type="radio" name="address_check" value="مطابق" onChange={HandleChange} className="report_input"/>مطابق </label>
                        <label><input type="radio" name="address_check" value="غير مطابق" onChange={HandleChange} className="report_input"/>غير مطابق</label>
                    </div>
                
                    <div className="report_row">
                        <div className="report_label">و بعد سؤال الجيران عنه تبين انه  </div>
                        <textarea name="neighbors_opinion" onChange={HandleChange} className="report_textarea"/>
                    </div>

                    <div className="report_row">
                        <div className="report_label"> والحالة المالية المذكورة تبدو من خلال ملاحظة </div>
                        <textarea name="financial_condition" onChange={HandleChange} className="report_textarea"/>
                    </div>
                    
                    <div className="report_row">
                        <div className="report_label">مصادر الدخل </div>
                        <input type="text" name="income" onChange={HandleChange} className="report_input"/>
                    </div>

                    <div className="report_row">
                        <div className="report_label">متوسط الدخل </div>
                        <input type="number" name="salary_average" onChange={HandleChange} className="report_input"/>
                    </div>

                    <div className="report_row">
                        <div className="report_label"> الحالة الاجتماعية  </div>
                            <label>أعزب <input type="radio" name="relationship" onChange={HandleChange} value="اعزب" /></label>
                            <label>متزوج <input type="radio" name="relationship" onChange={HandleChange} value="متزوج" /></label>
                            <label>مطلق <input type="radio" name="relationship" onChange={HandleChange} value="مطلق" /></label>
                    </div>

                    <div className="report_row" >
                        <div className="report_label">  عدد الابناء و مراحلهم السنية  </div>
                        <textarea name="sons" onChange={HandleChange} className="report_textarea"/>
                    </div>

                    <div  className="report_row">
                        <div className="report_label">  الالتزامات و القروض  </div>
                        <input type="text" name="debit" onChange={HandleChange} className="report_input"/>
                    </div>

                    <div  className="report_row">
                        <div className="report_label">الحد الائتماني </div>
                        <input type="text" name="debit_range" onChange={HandleChange} className="report_input"/>
                    </div>

                    <div  className="report_row">
                        <div className="report_label"> التقرير النهائي  </div>
                        <textarea name="final_report" onChange={HandleChange} className="report_textarea" />
                    </div>

                </div>
            </div>

            <div className="report_rows_container">الضامن
                <div>
                    <div className="report_row">
                    <div className="report_label"> بعد المعاينة للتاكد من عنوان الضامن اتضح ان العنوان : </div>
                        <label><input type="radio" name="g_address_check" value="مطابق" onChange={HandleChange} className="report_input"/>مطابق </label>
                        <label><input type="radio" name="g_address_check" value="غير مطابق" onChange={HandleChange} className="report_input"/>غير مطابق</label>
                    </div>
                
                    <div className="report_row">
                        <div className="report_label">و بعد سؤال الجيران عنه تبين انه  </div>
                        <textarea name="g_neighbors_opinion" onChange={HandleChange} className="report_textarea"/>
                    </div>
                        
                    <div className="report_row">
                        <div className="report_label"> والحالة المالية المذكورة تبدو من خلال ملاحظة </div>
                        <textarea name="g_financial_condition" onChange={HandleChange} className="report_textarea"/>
                    </div>

                    <div className="report_row">
                        <div className="report_label">مصادر الدخل </div>
                        <input type="text" name="g_income" onChange={HandleChange} className="report_input"/>
                    </div>

                    <div className="report_row">
                        <div className="report_label">متوسط الدخل </div>
                        <input type="number" name="g_salary_average" onChange={HandleChange} className="report_input"/>
                    </div>

                    <div className="report_row">
                        <div className="report_label"> الحالة الاجتماعية   </div>
                            <label>أعزب <input type="radio" name="g_relationship" value="اعزب" onChange={HandleChange}/></label>
                            <label>متزوج <input type="radio" name="g_relationship" value="متزوج" onChange={HandleChange}/></label>
                            <label>مطلق <input type="radio" name="g_relationship" value="مطلق" onChange={HandleChange}/></label>
                        
                    </div>

                    <div className="report_row">
                        <div className="report_label">  عدد الابناء و مراحلهم السنية  </div>
                        <textarea name="g_sons" className="report_textarea" onChange={HandleChange}/>
                    </div>

                    <div className="report_row">
                        <div className="report_label">  الالتزامات و القروض  </div>
                        <input type="text" name="g_debit" className="report_input" onChange={HandleChange}/>
                    </div>

                    <div className="report_row">
                        <div className="report_label">الحد الائتماني </div>
                        <input type="text" name="g_debit_range" className="report_input" onChange={HandleChange}/>
                    </div>

                    <div className="report_row">
                        <div className="report_label"> التقرير النهائي  </div>
                        <textarea name="g_final_report" className="report_textarea" onChange={HandleChange}/>
                    </div>
                </div>
            </div>
           

            
        </div>
        <div className="inquiry_bottom_btns_div">
                <button onClick={()=>Accept()} className="inquiry_bottom_btn">تأكيد</button>
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
