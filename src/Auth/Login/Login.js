import React,{useState,useEffect,useContext} from 'react'
import { data } from './../../Context/Context';
import { NavLink, useHistory } from 'react-router-dom';
import "./css/login.css";
import axios from 'axios';
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';

export default function Login() {
const history = useHistory()
const{setLoginstatus, setUsername, setAuth, auth}=useContext(data)
const[loginData, setLoginData]=useState([{username:'', password:''}])
const[loading, setLoading]=useState(false)
const[connect_msg, setConnectMsg]=useState(false)
const[error_msg, setErrMsg]=useState('')
const[redirect, setRedirect]=useState(false)
const[authType, setAuthType]=useState('')
const[matches, setMatches]=useState(window.matchMedia("(min-width: 1150px)").matches)

const handleChange =(e)=>{
    const arr = [...loginData]
    arr[0][e.target.name]=e.target.value
    setLoginData(arr)
}
const Submit = (e)=>{
    e.preventDefault();
    var regExp = /[a-z0-9]/i;
    if (!regExp.test(loginData[0]['username'])){( alert('اكتب البيانات باللغة الانجليزية...') )}
    else{
        setLoading(true)
        const data = loginData[0]
        axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/login',data)
        .then((response)=>{
            setLoading(false)
            setErrMsg(response.data.error_msg)
            if(response.data.auth){
                localStorage.setItem('token',  response.data.token);
                setLoginstatus(response.data.loginStatus)
                setUsername(response.data.result[0].username)
                setAuthType(response.data.result[0].auth)
                setAuth('true');
                //window.location.replace('/')
                setTimeout(() => {  setRedirect(true)  }, 100) 
            }
        })
        .catch((err)=>{
            setLoading(false)
            setConnectMsg(true)
            setTimeout(() => { setConnectMsg(false) }, 1500);
        })
    }
}

useEffect(() => {
    const handler = e => setMatches(e.matches)
    window.matchMedia("(min-width: 1150px)").addEventListener('change', handler);
}, [])

useEffect(() => { 
    if(redirect){
        if(authType === 'marketing'){history.push('/products')}
        else{history.push('/')}
    } 
}, [redirect])

return (
    <div className="Auth_Container">
        <img src={process.env.PUBLIC_URL+'/home/5.png'} className="login_image"/>
        <form className="Auth_Form" onSubmit={Submit}>
            <div className="form_error_msg">{error_msg}</div>
            <label className="login_input_label">اسم المعرض</label>
            <input type="text" name="username" value={loginData[0].username}  onChange={(e)=>handleChange(e)} className="Auth_input" placeholder="ادخل اسم المعرض...." required  />
            <label className="login_input_label"> كلمة السر</label>
            <input type="password" name="password" value={loginData[0].password}  onChange={(e)=>handleChange(e)} className="Auth_input" placeholder="ادخل الرقم السري...." required />
            <Button className="Auth_btn" type="submit" variant="contained"  >تسجيل الدخول</Button>
        </form>   
    {loading ? 
        <div id="Loading_Dialog">
            <div className="spinner_container">
                <div className="spinner spinner-circle"></div>
            </div> 
        </div>
    : ''}
    <div className={connect_msg ? "Connect_Dialog_hidden Connect_Dialog_show" : "Connect_Dialog_hidden"}> خطأ في الاتصال بالسيرفر!</div>
</div>
  )
}
