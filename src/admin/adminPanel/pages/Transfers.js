import React, { useState,useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import './tables.css'
import './transfer.css'
import jwt_decode from "jwt-decode";
import {BsPlusCircleDotted} from "react-icons/bs";
import {BiTransfer} from "react-icons/bi";
import  Button  from '@mui/material/Button';
import BranchFilter from './../../../pages/components/BranchFilter';
import { useHistory } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) { return <Slide direction="up" ref={ref} {...props} />; });

export default function Transfers() {
let history = useHistory();
const [branchname]=useState(jwt_decode(localStorage.getItem('token')).branchname)
const [branches,setBranches]=useState([])
const [branch_2,setBranch_2]=useState('')

const [auth]=useState(jwt_decode(localStorage.getItem('token')).authority)
const[params,setParams]=useState(new URLSearchParams(window.location.search));
const[url,setUrl]=useState(new URL(window.location));
const[bransh,setBransh]=useState(url.searchParams.has('branch') ? params.get('branch').split(","):'الكل');
const [products_count , setProductsCount] = useState('');
const [CachedData, setCachedData] = useState([])
const [Data, setData] = useState([])
const [loading , setloading] = useState(true);
const [search , setSearch] = useState('');
const[matches,setMatches] = useState(window.matchMedia("(min-width: 760px)").matches)
const[matches2,setMatches2] = useState(window.matchMedia("(min-width: 1075px)").matches)
const [popup, setPopup] = useState({ show: false, id: null});
const [loadingSmall, setloadingSmall] = useState(false);
const [transfer_branch, setTransferBranch] = useState('');
const [transfer_name, setTransferName] = useState('');
const [transfer_qnty, setTransferQnty] = useState();
const [current_transfer_qnty, setCurrentTransferQnty] = useState();
const [transfer_note, setTransferNote] = useState('');
const [product_id, setProduct_id] = useState();
const [price, setProduct_price] = useState();

const [open, setOpen] = React.useState(false);
const handleClickOpen = () => { setOpen(true);};
const handleClose = () => { setOpen(false); };

useEffect(() => {
    const handler = (e) => setMatches( e.matches ); 
    const handler2 = (e) => setMatches2( e.matches ); 
    window.matchMedia("(min-width: 760px)").addListener(handler)
    window.matchMedia("(min-width: 1075px)").addListener(handler2)
},[])
const GetData = async()=>{
    const body = {bransh:bransh}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/products-transfers',body,{
         headers:{"x-access-token":localStorage.getItem('token')}
     }).then((response)=>{
         const x = response.data.result
         const y = x.map((item)=>{return {...item,upState:false}})
         setData(y)
         setProductsCount(response.data.result.length)
         setCachedData(response.data.result)
         setloading(false)
     })
}
useEffect(()=>{ GetData() },[])

const HandleSearch = (e)=>{
    setSearch(e.target.value)
    if (e.target.value.length == 0) { setData(CachedData)}
}
const searchData = ()=>{
const searchValue = search.toLowerCase().trim();
const filteredData = CachedData.filter((item) => {
    return Object.keys(item).some((key) => item[key].toString().toLowerCase().indexOf(searchValue)> -1 );
});
setData(filteredData)
}

const X_Search = ()=>{
    setSearch('')
    setData(CachedData)
}

const UpdateRow = (i)=>{
    const arr = [...Data]
    arr[i]['upState'] = true
    setData(arr)
}

const CancelRow = (i)=>{
    const arr = [...Data]
    arr[i]['upState'] = false
    setData(arr)
}
const HandleChange = (e,i)=>{
    const arr = [...Data]
    arr[i][e.target.name] = e.target.value
    setData(arr)
}
const UpdateData = async(i,product_id)=>{
    const body = {product_id:product_id, product_name:Data[i]['product_name'], product_price:Data[i]['product_price'], quantity:Data[i]['quantity']}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-update-products',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        const arr = [...Data]
        arr[i]['upState'] = false
        setData(arr)
    })
}

/*--------Delete Popup confirm-----------*/
const deleteAlertHandle = (id)=>{  setPopup({show:true, id:id })  }

const DeleteProduct = async()=>{
    await axios.delete(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/admin-delete-product/${popup.id}`,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
       setData(Data.filter((val)=>{
           return val.product_id != popup.id
       }))
       setloadingSmall(false)
       setPopup({show:false,  id:null})
   })
}
useEffect(() => { GetData() }, [bransh])
const SetBranch = (e)=>{
    const sort = e.target.value;
    setBransh(sort);
    const q = params.get('branch');
    var url = new URL(window.location);
    (url.searchParams.has('branch') ? url.searchParams.set('branch',sort) : url.searchParams.append('branch',sort));
    url = decodeURIComponent(url)
    window.history.pushState('page2', 'Title', url);
    GetData()
}

const Transfer = (b, name,q,id,price)=>{
    setOpen(true)
    setTransferBranch(b)
    setTransferName(name)
    setCurrentTransferQnty(q)
    setProduct_id(id)
    setProduct_price(price)
}

const HandleTransferQnty = (e)=>{
    const x = e.target.value
    if(x >= current_transfer_qnty){setTransferQnty(current_transfer_qnty)}
    else if(x<=0){setTransferQnty(1)}
    else{setTransferQnty(x)}
}
const HandleTransferNote = (e)=>{setTransferNote(e.target.value) }

const SendRequest = ()=>{
    if(auth === 'admin'){
        if(transfer_branch===branch_2) {alert('لا يمكن اجراء التحويل من و الي نفس المعرض')}
        else{
            const data = {branchname:transfer_branch ,branch:branch_2, product_id:product_id, product_name:transfer_name, quantity:transfer_qnty, note:transfer_note, price:price, total:transfer_qnty*price }
            console.log(data);
            axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/transfer_request`,data,{
            headers:{"x-access-token":localStorage.getItem('token')}
            }).then((response)=>{
                setOpen(false)
            })
        }
    }
    else{
        const data = {branchname:branchname ,branch:transfer_branch, product_id:product_id, product_name:transfer_name, quantity:transfer_qnty, note:transfer_note, price:price, total:transfer_qnty*price }
        console.log(data);
        axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/transfer_request`,data,{
        headers:{"x-access-token":localStorage.getItem('token')}
        }).then((response)=>{
            setOpen(false)
        })
    }

}


useEffect(() => {
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/branches')
    .then((response)=>{
        const x = response.data.branches.filter((el)=>{return  el.branch_name !='الكل'})
        const obj = {'branch_name':''};
        setBranches([ obj, ...x])
    })
}, [])



    return (
        <div className="dashboard_center_content_container">
           <div className="products_cards">
                <div className="products_card">
                    <div className="words_prefix">عدد المنتجات</div>
                    {loading ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                        <div className="words_suffix"> {products_count}</div>
                    }
                </div>
                <div className="products_card">
                    <div className="words_prefix"><BsPlusCircleDotted className="add_product_icon" onClick={()=>history.push('/add-buyings')}/> </div>
                </div>
            </div>
            <div className="table_grap" >
            <div className="branchcorner"> <BranchFilter bransh={bransh} SetBranch={SetBranch} /></div>
                <div className="table_search_contents_ap">
                        <div className="search_box">
                                <input className="table_content_search_input" type="text" value={search}  onChange={(e)=>HandleSearch(e)} placeholder="ابحث هنا..." />  
                        </div>
                        {search.length > 0 &&
                        <button className="search_btn" id="emptySearchBtn" onClick={X_Search} >X</button>
                        }
                        <button className="search_btn" onClick={searchData} >بحث</button>
                </div>
                <table id="table_id" style={{direction:'rtl',width:matches2 ? "80%" : "100%"}}>
                {matches &&
                    <tr className="table_tr">
                        <th className="table_th">اسم منتج</th>
                        <th className="table_th">السعر</th>
                        <th className="table_th">الكمية</th>
                        <th className="table_th">المعرض</th>
                        <th className="table_th">-</th>
                        <th className="table_th">-</th>
                    </tr>
                    }
                    {Data.map((item, i)=>(
                        <tr className="table_tr" key={i+1}  >  
                            <td className="products_td_admin">{item.upState ?  <input name="product_name"  onChange={(e)=>HandleChange(e,i)} value={item.product_name} className="ap_update_date_input"/> : item.product_name }</td>
                            <td className="products_td_admin">{item.upState ?  <input name="product_price" onChange={(e)=>HandleChange(e,i)} value={item.product_price} className="ap_update_date_input"/> : item.product_price} جنية</td>
                            <td className="products_td_admin">{item.upState ?  <input name="quantity" onChange={(e)=>HandleChange(e,i)} value={item.quantity} className="ap_update_date_input"/> : item.quantity}</td>
                            <td className="products_td_admin">{item.upState ?  <input value={item.branch} className="ap_update_date_input"/> : item.branch}</td>
                            {item.upState ?  
                            <td className="products_td_admin">
                                <Button onClick={(e)=>CancelRow(i)} variant="contained" className="admin_panel_update_button" style={{background:'red'}}>الغاء</Button>
                                <Button onClick={(e)=>UpdateData(i,item.product_id)} variant="contained" className="admin_panel_update_button" style={{background:'green'}}>تأكيد</Button>
                            </td>
                            : 
                            <>
                            {item.branch == branchname?
                            <td className="products_td_admin"><Button disabled={ item.branch == branchname? false : true} onClick={(e)=>  UpdateRow(i) }  variant="contained" className="admin_panel_update_button">تعديل</Button></td>
                            :
                            <td className="products_td_admin"><Button  onClick={(e)=>Transfer(item.branch, item.product_name, item.quantity, item.product_id, item.product_price)}  variant="contained" className="admin_panel_update_button" style={{background:'rgb(125 210 0)',fontSize:'18px'}}><BiTransfer/></Button></td>
                        }
                            </>
                            }
                            {auth === 'admin' ?  
                                <td className="ap_users_td"><Button onClick={(e) =>deleteAlertHandle(item.product_id)}  variant="contained"  style={{background:'rgb(245 79 79)'}}>حذف</Button></td>
                            : 
                                <td className="ap_users_td"><Button disabled={item.branch == branchname ? false : true} onClick={(e) =>deleteAlertHandle(item.product_id)}  variant="contained"  style={{background:item.branch == branchname? 'rgb(245 79 79)' : 'rgb(213 213 213)'}}>حذف</Button></td>
                            } 
                            
                        </tr>
                    ))} 
                </table>
                
        </div>
            {popup.show ? 
                <div className="Are_you_sure_delete_container">
                    <div className="Are_you_sure_delete_div">
                    {loadingSmall ? <div className="spinner_container_small"><div className="spinner spinner-circle" id="small_spinner"></div></div> :
                        <>
                        <div className="Are_you_sure_delete_word" >هل انت متأكد من حذف المنتج ?</div>
                        <button className="handel_delete_btns" id="confirm_delete_btn" onClick={DeleteProduct}>نعم</button>   
                        <button className="handel_delete_btns" id="cancel_delete_btn" onClick={()=>setPopup({show:false,id:null})}>لا</button>
                        </>
                    }
                    </div> 
                </div>
            : ''}
        {/*----------------------------------------------------------------------------------------------*/}
        <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {auth === 'admin' ? <DialogTitle style={{direction:'rtl'}}>{`${transfer_branch.length>0 ? transfer_branch : '......'} الي ${branch_2.length > 0 ? branch_2 : '.....'} `}</DialogTitle> : <DialogTitle>{`طلب تحويل من فرع ${transfer_branch}`}</DialogTitle>}
        
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" style={{direction:'rtl'}}>
            <div className="transfer_inputs">
                {auth !='admin' &&
                <>
                    <label className="transfer_label">الفرع</label>
                    <input disabled type="text" value={transfer_branch} className="transfer_input"/>
                </>
                }
                {auth ==='admin' &&
                <>
                    <label className="transfer_label">من فرع</label>
                    <input disabled type="text" value={transfer_branch} className="transfer_input"/>
                </>
                }
                {auth ==='admin' &&
                <>
                    <label className="transfer_label">الي فرع</label>
                    <select name="branch_name" id="add_cash_select_branch" className="add_cash_input" value={branch_2} onChange={(e)=>{ setBranch_2(e.target.value) }} className="filter_option" required>
                        {branches.map((item,key)=>
                            <option value={`${item.branch_name}`}>{item.branch_name}</option>
                        )}
                    </select>
                </>
                }

                <label className="transfer_label">اسم المنتج</label>
                <input disabled type="text" value={transfer_name} className="transfer_input"/>

                <label className="transfer_label">الكمية</label>
                <input onChange={(e)=>HandleTransferQnty(e)} type="number" value={transfer_qnty} min="1" max={current_transfer_qnty} className="transfer_input"/>
               
                <label className="transfer_label">ملاحظة</label>
                <textarea onChange={(e)=>HandleTransferNote(e)} type="text" value={transfer_note}  className="transfer_input" rows="4"/>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="send_transfer_order_btn" onClick={SendRequest}>ارسال الطلب</Button>
        </DialogActions>
      </Dialog>
    </div>

        </div>
    )
}
