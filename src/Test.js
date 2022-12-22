import React ,{useState,useEffect,useMemo,useContext} from 'react'
import axios from 'axios';
import { data } from './Context/Context';

export default function Test() {
const {branchname} = useContext(data)
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

useEffect(() => {
   const body = {date:date,branch:branchname}
    axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/get-details-today`,body,{
    headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        console.log(response.data.alldata[2].account);
        setAdvances(response.data.alldata[0].advances)
        setPremium(response.data.alldata[1].premium)
        setBalance(response.data.alldata[2].account)
        setProductExpenses(response.data.alldata[3].buyings)
        setInquiries(response.data.alldata[4].inquiries)
    })
}, [])

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

  return (
     <div className="dashboard_center_content_container">
        <div className="cards">
            <div className="dash_board_card">
                <span className="words_prefix">التاريخ</span>
                <span className="words_suffix">{date}</span>
            </div>
            
            <div className="dash_board_card">
                    <span className="words_prefix">الرصيد اول اليوم</span> 
                    <span className="words_suffix">{balance}</span>
            </div>
            <div className="dash_board_card">
                    <span className="words_prefix">الرصيد اخر اليوم</span> 
                    <span className="words_suffix">{OverallBalance} </span>
            </div>


            <div className="dash_board_card">
                    <span className="words_prefix">المقدمات</span> 
                    <span className="words_suffix">{advances}</span>
            </div>
            <div className="dash_board_card">
                    <span className="words_prefix">الاستعلامات</span> 
                    <span className="words_suffix">{inquiries}</span>
            </div>
            <div className="dash_board_card">
                    <span className="words_prefix">التحصيل</span> 
                    <span className="words_suffix">{premium}</span>
            </div>
            <div className="dash_board_card">
                    <span className="words_prefix">اجمالي الوارد </span> 
                    <span className="words_suffix">{totalIncome}</span>
            </div>
            <div className="dash_board_card">
                    <span className="words_prefix"> المنصرف بضاعة </span> 
                    <span className="words_suffix">{product_expenses}</span>
            </div>
            <div className="dash_board_card">
                    <span className="words_prefix">منصرف اخر</span> 
                    <span className="words_prefix"><input type="number" value={other_expenses} onChange={(e)=>handleOtherExpenses(e)}/></span> 
            </div>
            <div className="dash_board_card">
                <span className="words_prefix">اجمالي المنصرف</span> 
                <span className="words_suffix">{Total_expenses}</span>
            </div>
        </div>
    </div>
  )
}
