import React ,{useState,useEffect,useContext}from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import GoBack from './../../../components/Back';
import HeaderMenu from './../../../components/HeaderMenu';
import '../css/order_info.css'
import jwt_decode from "jwt-decode";

export default function CashOrderInfo() {
const [Order,setOrder] = useState([]);
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [UserInfo,SetUserInfo] = useState([]);
const { nat_id,date } = useParams();
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
const[loading, setLoading]=useState(false)
const[connect_msg, setConnectMsg]=useState(false)
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1)},[])

const OrderInfo =()=>{
    setLoading(true)
    const body = {nat_id:nat_id, date:date, branch:branchname}
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/cash-order-info',body,
    {headers:{ "x-access-token":localStorage.getItem('token')} })
    .then((response)=>{
        setLoading(false)
        setOrder(response.data.result)
        const UserData= [{
        username:response.data.result[0].username ,
        nat_id:response.data.result[0].nat_id ,
        phone_number:response.data.result[0].phone_number,
        date:response.data.result[0].date, }]
        SetUserInfo(UserData)
    })
    .catch((err)=>{
        setLoading(false)
        setConnectMsg(true)
        setTimeout(() => { setConnectMsg(false) }, 1500);
    })
}
useEffect(() => {
OrderInfo()
}, [])

    return (
        <div className="Page_Container">
            <div className="Page_Header"> 
                <GoBack/>
                {!matches1 && <HeaderMenu/>}
                <div className="Header_word">تفاصيل فاتورة نقدي</div>
            </div>

          <div className="cash_order_container">
                <div className="cash_order_user_data">
                    {UserInfo.map((item)=>
                    <>
                        <div className="cash_order_user_div">
                            <label className="cash_order_label">الاسم/</label>
                            <div className="cash_order_user_inf">{item.username}</div>
                        </div>
                        <div className="cash_order_user_div">
                            <label className="cash_order_label">الرقم القومي/</label>
                            <div className="cash_order_user_inf">{item.nat_id}</div>
                        </div>
                        <div className="cash_order_user_div">
                            <label className="cash_order_label">رقم الهاتف/</label>
                            <div className="cash_order_user_inf">{item.phone_number}</div>
                        </div>
                        <div className="cash_order_user_div">
                            <label className="cash_order_label">التاريخ /</label>
                            <div className="cash_order_user_inf">{item.date}</div>
                        </div>
                    </>
                    )}
                </div>

                <table id="table_id">
                <tr className="table_tr_head">
                    <th className="table_th">المنتج</th>
                    <th className="table_th">السعر</th>
                    <th className="table_th">الكمية</th>
                    <th className="table_th">الاجمالي</th>
                </tr>
                {Order.map((item,i)=>
                    <tr className="table_tr" key={i}>
                        <td className="table_td cash_order_td">{item.product_name}</td>
                        <td className="table_td cash_order_td">{item.product_price}</td>
                        <td className="table_td cash_order_td">{item.quantity}</td>
                        <td className="table_td cash_order_td">{item.total_price}</td>
                    </tr>
                    )}
                </table>
                
            </div>

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
