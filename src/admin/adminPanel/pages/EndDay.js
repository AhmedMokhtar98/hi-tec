
import React ,{useState,useEffect,useMemo,useContext} from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";

export default function EndDay() {
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const[date]=useState(new Date().toLocaleDateString('fr-CA'))
const[advances,setAdvances]=useState(0)
const[premium,setPremium]=useState(0)
const[balance,setBalance]=useState(0)
const[product_expenses,setProductExpenses]=useState(0)
const[inquiries,setInquiries]=useState(0)
const[totalIncome,setTotalIncome]=useState(0)
const[other_expenses,setOtherExpenses]=useState(0)
const[Total_expenses,setTotalExpenses]=useState(0)
const[OverallBalance,setOverallBalance]=useState(0)
const [loading , setloading] = useState(true);
const [success_msg , setSuccessMsg] = useState(false);

const GetData = () => {
   const body = {date:date,branch:branchname}
    axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/get-details-today`,body,{
    headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        setAdvances(response.data.alldata[0].advances)
        setPremium(response.data.alldata[1].premium)
        setBalance(response.data.alldata[2].account)
        setProductExpenses(response.data.alldata[3].buyings)
        setInquiries(response.data.alldata[4].inquiries)
        setloading(false)
    })
}

const getdata = useMemo(() => {
  return GetData();
}, []);

const calculationWithMemo = useMemo(() => {
  return calc(premium,advances,inquiries,product_expenses,other_expenses,balance);
}, [premium,advances,inquiries,product_expenses,other_expenses,balance]);

function calc(premium,advances,inquiries,product_expenses,other_expenses,balance) {
    const total_income = (premium)+(advances)+(inquiries)
    const total_expenses = Number(product_expenses) + Number(other_expenses)
    setTotalIncome(premium+advances+inquiries)
    setTotalExpenses(product_expenses + Number(other_expenses))
    setOverallBalance((balance + total_income) - Number(total_expenses))
}

const handleOtherExpenses = (e)=>{
    setOtherExpenses(e.target.value)
    calc(premium,advances,inquiries,product_expenses,other_expenses,balance)
}

const EndDay = ()=>{
        const body = {
        date:date,
        branch:branchname,
        initial_account:balance,
        inquiry:inquiries ==null ? 0 : inquiries,
        advance:advances ==null ? 0 : advances,
        total_premium:premium == null ? 0 :premium,
        total_income:totalIncome == null ? 0 : totalIncome,
        product_expenses:product_expenses == null ? 0 :product_expenses,
        other_expenses:other_expenses == null ? 0 :other_expenses,
        total_expenses:Total_expenses == null ? 0 : Total_expenses,
        final_account:OverallBalance
        }
    axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/end-day`,body,{
           headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        setSuccessMsg(true)
        setTimeout(() => {
            setSuccessMsg(false)
        }, 1500);
    })
}
  return (
     <div className="dashboard_center_content_container">
        <div className="dashboard_cards">
            <div className="end_day_card_date end_day_card">
                <div className="end_day_prefix end_day_date_prefix">التاريخ /</div>
                <div className="end_day_suffix end_day_date_suffix">{date}</div>
            </div>
            <div className="end_day_account_info">
                <div className="dashboard_card initial_account">
                        <div className="end_day_prefix">الرصيد اول اليوم</div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                <div className="end_day_suffix">{balance} جنية</div>
                }
                </div>
                <div className="dashboard_card final_account">
                        <div className="end_day_prefix">الرصيد اخر اليوم</div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                <div className="end_day_suffix">{OverallBalance} جنية</div>
                }
                </div>
            </div>
            <div className="end_day_income_info">     
                <div className="dashboard_card">
                        <div className="end_day_prefix">المقدمات</div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                <div className="end_day_suffix">{advances> 0 ? advances : 0 }</div>
                }
                </div>
                <div className="dashboard_card">
                        <div className="end_day_prefix">الاستعلامات</div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                <div className="end_day_suffix">{inquiries > 0 ? `جنية` + inquiries : 0 }</div>
                }
                </div>
                <div className="dashboard_card">
                        <div className="end_day_prefix">التحصيل</div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                <div className="end_day_suffix">{premium> 0 ? premium : 0 }</div>
                }
                </div>
                <div className="dashboard_card">
                        <div className="end_day_prefix">اجمالي الوارد </div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                <div className="end_day_suffix">{totalIncome> 0 ? totalIncome : 0 }</div>
                }
                </div>
            </div>
            <div className="end_day_out_info">     
                <div className="dashboard_card">
                        <div className="end_day_prefix"> منصرف بضاعة </div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                <div className="end_day_suffix">{product_expenses> 0 ? product_expenses : 0 }</div>
                }
                </div>
                <div className="dashboard_card">
                        <div className="end_day_prefix">منصرف اخر</div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                 <div className="end_day_prefix"><input type="number" value={other_expenses} onChange={(e)=>handleOtherExpenses(e)} className="input_other_expense"/></div> 
                }
                </div>
                <div className="dashboard_card">
                        <div className="end_day_prefix">اجمالي المنصرف</div> 
                {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                <div className="end_day_suffix">{Total_expenses> 0 ? Total_expenses : 0 }</div>
                }
                </div>
            </div>
                <button className="EndDayBtn" onClick={EndDay}>انهاء اليوم</button>
                <div className={success_msg ? "Success_Dialog_hidden Success_Dialog_show" : "Success_Dialog_hidden"}>! تم انهاء اليوم بنجاح</div>
        </div>
    </div>
  )
}
