import React,{useState, useEffect} from 'react'
import './user_profile.css'
import { useParams } from 'react-router-dom';
import axios from 'axios'

export default function UserProfile() {
const params = useParams()
const[Data, setData] = useState([])
const[rate, setRate] = useState(null)
const[issues, setIssues] = useState('')
const[code, setCode] = useState(null)
const[branch, setUserBranch] = useState('')

const GetData = async()=>{
    const body = {nat_id:params.nat_id}
    await axios.post('http://localhost:8080/api/user-profile',body,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
        console.log(response);
         setData([response.data.result[0]])
         setUserBranch(response.data.result[0].branch)
         setCode(response.data.result[0].code)
         setIssues(response.data.result[0].issues)
     })
}

useEffect(() => {
    GetData()
    getRate()
}, [])

const getRate = ()=>{
    const body = {nat_id:params.nat_id}
    axios.post('http://localhost:8080/api/user-rate',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        setRate(response.data.result.length)
    })
}


  return (
    <div className="profile_center_content_container ">
        <div className="user_profile_">
            <img src={process.env.PUBLIC_URL+'/home/user.png'} className="user_image"/>
        </div>
        <div className="profile_status_banner">
            <div className="banner_card_div" id="fines_card">
                <div>عدد الغرامات</div>
                <div className="rating_section">{rate}</div>
            </div>
            <div className="banner_card_div" id="ratecondition_card">
                <div>حالة العميل</div>
                <div className="rating_section">{(rate == 0) ? 'ممتاز' :   (3 >= rate > 0) ? 'جيد' : (3 < rate <=6) ? 'مقبول' : (rate > 6) && 'غير منضبط'}</div>
            </div>
            <div className="banner_card_div" id="branch_card">
                <div>الفرع</div>
                <div className="rating_section">{branch}</div>
            </div>
            <div className="banner_card_div" id="code_card">
                <div>الكود</div>
                <div className="rating_section">{code> 0 ? code : 'لم يسجل بعد'}</div>
            </div>
            <div className="banner_card_div" id="issues_card">
                <div>القضايا</div>
                <div className="rating_section">{issues==='x' ?'مسجل بالقضايا' : 'غير مسجل'}</div>
            </div>
        </div>
        {Data.map((item,key)=>
        <div className="user_info_row">
        <div className="row_label">الاسم</div>
        <input type="text" name="username" value={item.username} className="user_row_input"/>
        <div className="row_label">الشهرة</div>
        <input type="text" name="nickname" value={item.nickname} className="user_row_input"/>
        <div className="row_label">الرقم القومي</div>
        <input type="text" name="nat_id" value={item.nat_id}className="user_row_input"/>
        <div className="row_label">رقم الهاتف</div>
        <input type="text" name="phone_number" value={item.phone_number} className="user_row_input"/>
        <div className="row_label">العنوان</div>
        <input type="text" name="address" value={item.address} className="user_row_input"/>
        <div className="row_label">الوظيفة</div>
        <input type="text" name="job" value={item.job} className="user_row_input"/>
        <div className="row_label">الراتب</div>
        <input type="text" name="salary" value={item.salary} className="user_row_input"/>
        <div className="row_label">الفرع</div>
        <input type="text" name="branch" value={item.branch} className="user_row_input"/>
        <div className="row_label">تاريخ التسجيل</div>
        <input type="text" name="branch" value={item.date} className="user_row_input"/>

    </div>
        )}
        
    </div>
  )
}
