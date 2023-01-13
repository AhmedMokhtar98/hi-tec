import React,{useState} from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import {BiLockAlt} from 'react-icons/bi'
import {FiEye,FiEyeOff} from 'react-icons/fi'
import './css/password_change.css'

export default function PasswordChange() {
const[show_password,setShowPassword]=useState(false)
const[loading,setLoading]=useState(false)
const[success_msg,setSuccessMsg]=useState(false)
const[password,setPassword]=useState([{password_1:'' ,password_2:''}])
const[userid] = useState(`${localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')).id : ''}`);

const HandlePassword = (e)=>{
    var arr = [...password]
    arr[0][e.target.name]=e.target.value
    setPassword(arr)
}
const Submit = (e)=>{
    e.preventDefault()
    if(password[0]['password_1'] !== password[0]['password_2']){
        alert('الرقم السري غير متطابق')
    }
    else{
        var regExp = /[a-z0-9]/i;
        if (!regExp.test(password[0]['password_1'])){( alert('الرقم السري يجب ان يكون باللغة الانجليزية أو الارقام..') )}
        else{
            setLoading(true)
            const body = {password:password[0]['password_1'], userid:userid}
            axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/change_password-2',body,
            {headers:{ "x-access-token":localStorage.getItem('token')} })
            .then((response)=>{
                setLoading(false)
                setSuccessMsg(true)
                setTimeout(() => { setSuccessMsg(false) }, 1500);
            })
        }
    }
   
}



  return (
    <div className="dashboard_center_content_container">
        <div className="Add_file_header">تغيير الرقم السري </div>

        <form onSubmit={Submit} className="Password_change_form" autoComplete="off">
           <div className="P_chnge_header_icon"><BiLockAlt/></div> 
            <div className="password_change_inputs_divs">
                {password.map((item,index)=>
                <>
                    <div className="P_chnge_input_line"> {show_password ? <FiEye className="P_chnge_eye_icon" onClick={()=>setShowPassword(false)}/> : <FiEyeOff className="P_chnge_eye_icon" onClick={()=>setShowPassword(true)}/>} 
                        <input value={item.password_1}  type={show_password ? 'text' : 'password'} name="password_1" onChange={(e)=>HandlePassword(e)} className="P_chnge_input" placeholder="....اكتب الرقم السري الجديد" autoComplete="off"/> 
                    </div>
                    <div className="P_chnge_input_line"> {show_password ? <FiEye className="P_chnge_eye_icon" onClick={()=>setShowPassword(false)}/> : <FiEyeOff className="P_chnge_eye_icon" onClick={()=>setShowPassword(true)}/>} 
                        <input value={item.password_2}  type={show_password ? 'text' : 'password'} name="password_2" onChange={(e)=>HandlePassword(e)} className="P_chnge_input" placeholder="....أعد كتابة الرقم السري" autoComplete="off"/>  
                    </div>
                </>
                )}
            </div>
            <button type="submit" className="P_chnge_button">تأكيد</button>
        </form>
        {loading ? 
                    <div id="Loading_Dialog">
                        <div className="spinner_container">
                            <div className="spinner spinner-circle"></div>
                        </div> 
                    </div>
                : ''}
        <div id="password_change_success_msg" className={success_msg ? "Success_Dialog_hidden Success_Dialog_show" : "Success_Dialog_hidden"}>تم تحديث كلمة السر بنجاح</div>

    </div>
  )
}
