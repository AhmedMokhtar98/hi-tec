import React, { Component } from 'react'
import '../css/add_cash.css';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from 'axios';
import { data } from './../../../../Context/Context';
import GoBack from './../../../components/Back';
import HeaderMenu from './../../../components/HeaderMenu';
import arLocale from "date-fns/locale/ar-EG";
import jwt_decode from "jwt-decode";
const localeMap = {
  ar: arLocale,
};
/*
const branches = [
{ label: "الشريف"},
{ label: "الجوهرة"},
{ label: "الماسة"}
];
*/


export default class AddCashOrder extends Component {
    static contextType = data
    constructor(props) {
        super(props)
        this.state = {
             branchname:jwt_decode(localStorage.getItem('token')).branchname,
             auth:jwt_decode(localStorage.getItem('token')).authority,
             Products:[],
             exist_quantity:[{qnty:null}],
             date:new Date(),
             ClientData:[{branch_name:'',username:'',phone_number:'',nat_id:null,date:new Date().toLocaleDateString('fr-CA')}],
             nat_id:null,
             product_name:'',
             product_price:null,
             quantity:null,
             overall_price:null,
             locale:'ar',
             ProductData:[{product_name:'',quantity:null,product_price:null,total_price:null,nat_id:null,date:new Date().toLocaleDateString('fr-CA'), branch:jwt_decode(localStorage.getItem('token')).branchname}],
             matches: window.matchMedia("(min-width: 950px)").matches,
             matches2: window.matchMedia("(min-width: 760px)").matches,
             openDialog:false,
             loading:false,
             success_msg:false,
             branches:[],
             code:''
        }
    }


/*-----------------------ClientData---------------------------*/
handleClientData = (e)=>{
    const list = [...this.state.ClientData]
    list[0][e.target.name] = e.target.value
    this.setState({ClientData:list})
}
/*-----------------------Nat_ID-------------------------------*/
handleNat_id = (e)=>{
    const Clientlist_nat_id = [...this.state.ClientData]
    Clientlist_nat_id[0]['nat_id'] = e.target.value

    this.setState({
        nat_id:e.target.value,
        ClientData:Clientlist_nat_id,
    },function(){
        if(this.state.ProductData.length>0){
            let updateObjects = [];
            updateObjects=this.state.ProductData.map(item=>({...item, nat_id: this.state.nat_id}));
            this.setState({ProductData:updateObjects})
        }
        else{
            const Productlist_nat_id  = [...this.state.ProductData]
            Productlist_nat_id[0]['nat_id'] = this.state.nat_id
            this.setState({ProductData:Productlist_nat_id})
        }
    })
}
/*------------------------Date Time-----------------------------*/
handleDate = (value)=>{
    const dataValue = value.toLocaleDateString('fr-CA')

    const Clientlist_date = [...this.state.ClientData]
    Clientlist_date[0]['date'] = dataValue
    this.setState({ ClientData:Clientlist_date })

     if(this.state.ProductData.length>0){
        let updateObjects = [];
        updateObjects=this.state.ProductData.map(item=>({...item, date: dataValue}));
        this.setState({ProductData:updateObjects})
    }
    else{
        const Productlist_date = [...this.state.ProductData]
        Productlist_date[0]['date'] = dataValue
        this.setState({ProductData:Productlist_date})
    }
}
/*-----------------------------Product Name-----------------------------------*/
 SelectProductName = (e,index,value)=>{
    const list = [...this.state.ProductData]
    list[index]['product_name'] = value
    this.setState({
        ProductData:list,
        //product_name:value,
    },function(){
    const productQnty = null //this.state.exist_quantity[index]['qnty']
        const listQnty = [...this.state.ProductData]
        listQnty[index]['quantity'] = null //productQnty
        this.setState({
            ProductData:listQnty,
            quantity:productQnty
        })
    })
   
}


/*-----------------------------ProductData Calculation-----------------------------------*/

handleChange = (e,index)=>{
const list = [...this.state.ProductData]
if(e.target.name == 'quantity'){
    const checkQnty = [...this.state.ProductData]
    checkQnty[index]['quantity'] =  e.target.value <1 ? 0 : e.target.value 
    this.setState({
        ProductData:checkQnty,
        quantity: e.target.value
    },()=>{
            if(this.state.ProductData[index]['quantity'] > this.state.exist_quantity[index]['qnty']){
                const LimitQnty = [...this.state.ProductData]
                LimitQnty[index]['quantity'] =  this.state.exist_quantity[index]['qnty']
                this.setState({
                    ProductData:LimitQnty,
                    quantity:this.state.exist_quantity[index]['qnty']
                },()=>{
                    if(e.target.name === 'product_price' || e.target.name === 'quantity'){
                        this.calculation(index) // Calculation Function Call
                        if(list[index]['quantity']<1 ){
                            const upTotal = [...this.state.ProductData]
                            upTotal[index]['total_price']=0
                            upTotal[index]['quantity']=0
                            this.setState({ProductData:upTotal,quantity:0},()=>{this.calculation(index)})
                        }
                    }
                })
            }
        })
}

if(e.target.name != 'quantity'){
    list[index][e.target.name] =  e.target.value
}
if(e.target.name == 'product_price'){
    this.setState({product_price: Number(e.target.value) })
}
this.setState({
    ProductData:list,
    },()=>{
    if(e.target.name === 'product_price' || e.target.name === 'quantity'){
        this.calculation(index)// Calculation Function Call
        if(list[index]['quantity']<1 ){
            const upTotal = [...this.state.ProductData]
            upTotal[index]['total_price']=0
            upTotal[index]['quantity']=0
            this.setState({
            ProductData:upTotal,
            quantity:0
            },()=>{
            this.calculation(index)})
        }
    }
    })
}

calculation = (index)=>{
    const product_price = this.state.product_price
    const quantity = this.state.quantity
    const listMeasure = [...this.state.ProductData]
    listMeasure[index]['total_price'] = ((product_price) + (product_price*0.07)) * (quantity)
    this.setState({ProductData:listMeasure})
    let sum = this.state.ProductData.reduce(function(prev, current) {return prev + +current.total_price}, 0);
    this.setState({overall_price:sum})
}


 AddRow = ()=>{
    const array = this.state.ProductData.slice()
    array.push({product_name:'', quantity:null, product_price:null, total_price:null, nat_id:this.state.nat_id,date:this.state.date.toLocaleDateString('fr-CA'), branch:this.state.branchname})
    
    const arrayQnty = this.state.exist_quantity.slice()
    arrayQnty.push({qnty:null})

    this.setState({
        ProductData:array,
        exist_quantity:arrayQnty,
        quantity:0
        })
      console.log('ProductData',this.state.ProductData)
}
 RemoveRow = (e,index)=>{
    e.preventDefault();
    const list = [...this.state.ProductData]
    list.splice(index,1)
    this.setState({ProductData:list},function(){
        let sum = this.state.ProductData.reduce(function(prev, current) {
        return prev + +current.total_price
        }, 0);
        this.setState({overall_price:sum})
    })
      
}

DeletAllRows=()=>{
    const array = [{product_name:'',quantity:null,product_price:null,total_price:null,nat_id:this.state.nat_id,date:this.state.date.toLocaleDateString('fr-CA'), branch:this.state.branchname}]
    this.setState({ ProductData:array})
}

generateSerial = ()=> {
    var chars = '1234567890ABCDEFGabcdefg',
        serialLength = 5,
        randomSerial = "",
        i,
        randomNumber;
    for (i = 0; i < serialLength; i = i + 1) {
        randomNumber = Math.floor(Math.random() * chars.length);
        randomSerial += chars.substring(randomNumber, randomNumber + 1);
    }
    this.setState({code:randomSerial})
}

Submit = async (e)=>{
    e.preventDefault()
    this.setState({loading:true})
    const x =  this.state.ProductData.map(obj => ({ ...obj, code:this.state.code }))
    var result1 = x.map(({product_name,quantity,product_price,total_price,nat_id,date,branch,code}) => [product_name,quantity,product_price,total_price,nat_id,date,branch,code]);
    const data = {
        branch:this.state.branchname,
        username:this.state.ClientData[0].username,
        phone_number:this.state.ClientData[0].phone_number,
        nat_id:this.state.nat_id,
        date:this.state.ClientData[0].date,
        overall_price:this.state.overall_price,
        code:this.state.code
    }
    // console.log(data);
    // console.log('result1',result1);
    await axios.post("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/add-cash-process-2",data)
    .then((response)=>{
        axios.post("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/add-cash-data-2",result1)
        .then((response2)=>{
            this.setState({
                    loading:false,
                    success_msg:true,
                    ProductData:[{product_name:'',quantity:null,product_price:null,total_price:null,nat_id:null,date:new Date().toLocaleDateString('fr-CA'), branch:jwt_decode(localStorage.getItem('token')).branchname}],
                    ClientData:[{branch_name:'',username:'',phone_number:null,nat_id:null,date:new Date().toLocaleDateString('fr-CA')}],
                    overall_price:null,
                })
             setTimeout(() => {
                 this.setState({success_msg:false})
             }, 1500);
         })
     })
     e.target.reset()
}

handleClickOpenDialog = () => { this.setState({ openDialog:true})};
handleCloseDialog = () => {this.setState({openDialog:false })};

HandleMedia = ()=>{
    const handler = (e) => this.setState({matches: e.matches});
    window.matchMedia("(min-width: 950px)").addEventListener('change', handler);
}
HandleMedia2 = ()=>{
    const handler2 = (e) => this.setState({matches2: e.matches});
    window.matchMedia("(min-width: 760px)").addEventListener('change', handler2);
}
componentDidUpdate(prevState) { 
    if (prevState.matches !== this.state.matches) {
        this.HandleMedia()
    }
    if (prevState.matches2 !== this.state.matches2) {
        this.HandleMedia2()
    }
}
ProductsMenu = ()=>{
    this.context.setNavHidden(true)
    const body ={ branch:this.state.branchname }
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/products-select-2',body)
    .then((response)=>{
        this.setState({Products:response.data.result})
    })
}


 AutoPrice = (index,product_price,existQnty)=>{
    if(this.state.ProductData.length>0){
        const Productlist= [...this.state.ProductData]
        Productlist[index]['product_price'] = product_price

        const exist_qty= [...this.state.exist_quantity]
        exist_qty[index]['qnty'] = existQnty

        this.setState({
            ProductData:Productlist,
            product_price:product_price,
            exist_quantity:exist_qty
        })
    }
    else{
        const Productlist2= [...this.state.ProductData]
        Productlist2[0]['product_price'] = product_price
        this.setState({
            ProductData:Productlist2,
            product_price:product_price,
        })
    }
}
componentDidMount(){
    this.generateSerial()
    axios.get('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/branches-2')
    .then((response)=>{
        console.log('branches',response.data.branches);
        const x = response.data.branches.filter((el)=>{return  el.branch_name !='الكل'})
        const obj = {'branch_name':''};
        this.setState({branches:[ obj, ...x]})
    })
    
    this.context.setNavHidden(true)
    const body ={ branch:this.state.branchname }
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/products-select-2',body)
    .then((response)=>{
        this.setState({Products:response.data.result})
    })
}
    render() {
        return (
             <div className="Page_Container">
                <div className="Page_Header"> 
                    <GoBack/>
                     {!this.state.matches && <HeaderMenu/>}
                     <div className="Header_word">اضافة فواتير نقدي</div>
                </div>
                <form onSubmit={(e)=>this.Submit(e)}>
                <div className="Adding_form_container">
                    <div className="Sections" id="Client_Data_Sections">
                       <div className="Section_splite_column">
                        <div className="add_cash_input_Row">
                            <label className="add_cash_input_label">الفرع</label>
                            {this.state.auth ==='admin' ? 
                                <select name="branch_name" id="add_cash_select_branch" className="add_cash_input" value={this.state.branchname} onChange={(e)=>{this.setState({branchname:e.target.value}); setTimeout(() => {this.ProductsMenu() }, 100);}} className="filter_option">
                                    {this.state.branches.map((item,key)=>
                                        <option value={`${item.branch_name}`}>{item.branch_name}</option>
                                    )}
                                </select>
                            :
                                <select name="branch_name" id="add_cash_select_branch" className="add_cash_input" value={this.state.branchname} onChange={(e)=>{this.setState({branchname:e.target.value}); setTimeout(() => {this.ProductsMenu() }, 100);}} className="filter_option">
                                    <option value={`${this.state.branchname}`}>{this.state.branchname}</option>
                                </select>
                            }
                        </div>

                        <div className="add_cash_input_Row">
                            <label className="add_cash_input_label">التاريخ</label>
                            <LocalizationProvider locale={localeMap[this.state.locale]} dateAdapter={AdapterDateFns}>
                                <MobileDatePicker id="add_cash_date_picker"  label="التاريخ" value={this.state.date} onChange={(newValue) => { this.setState({ date:newValue}); this.handleDate(newValue)}} renderInput={(params) => <TextField {...params} required/>}/>
                            </LocalizationProvider>
                        </div>

                        </div>
                        <div className="Section_splite_column">
                            <div className="add_cash_input_Row">
                                <label className="add_cash_input_label">اسم العميل</label>
                                <input  name="username" type="text" value={this.state.ClientData[0].username} onChange={this.handleClientData} placeholder="اسم العميل" className="add_cash_input" autoComplete="off" required/>
                            </div>

                            <div className="add_cash_input_Row">
                                <label className="add_cash_input_label">رقم الهاتف</label>
                                <input  name="phone_number" type="number" value={this.state.ClientData[0].phone_number} onChange={this.handleClientData}  placeholder="رقم الهاتف" className="add_cash_input" autoComplete="off" required/>
                            </div>

                            <div className="add_cash_input_Row">
                                <label className="add_cash_input_label">الرقم القومي</label>
                                <input  name="nat_id" type="number" value={this.state.ClientData[0].nat_id} onChange={this.handleNat_id}  placeholder="الرقم القومي" className="add_cash_input" autoComplete="off" required/>
                            </div>
                        </div>
                    </div>

                    <div  id="Orders_Data_Section">
                        <div className="Orders_Data_Section_table_container">
                            <tabel id="table_id">
                            {this.state.matches2 && 
                                <tr className="table_tr_head">
                                    <th className="table_th">المنتج</th>
                                    <th className="table_th">السعر</th>
                                    <th className="table_th">الكمية</th>
                                    <th className="table_th">الاجمالي</th>
                                    <th className="table_th">اضافة</th>
                                    <th className="table_th">حذف</th>
                                </tr>
                            }
                                {this.state.ProductData.map((item,index)=>
                                <tr className="AddCashTable_tr" key={index}>
                                    <td className="table_td add_cash_td">
                                        {this.state.matches ? 
                                            <>
                                            <Autocomplete    sx={{ display: 'inline-block', width:'100%' ,'& input': {
                                                    bgcolor: 'background.paper', color: (theme) =>
                                                    theme.palette.getContrastText(theme.palette.background.paper),
                                                }}}
                                                id="custom-input-demo"
                                                onInputChange={(e, value) => this.SelectProductName(e,index,value)}
                                                getOptionLabel={(option) => option.product_name}
                                                options={this.state.Products}
                                                renderOption={(props, option) => (
                                                    <div onClick={(e)=> this.AutoPrice(index,option.product_price,option.quantity)}>
                                                        <Box component="li"  {...props} key={option.id}>
                                                            {option.product_name}
                                                        </Box>
                                                    </div>
                                                )}
                                                renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                     <TextField  fullWidth type="text" {...params.inputProps} className="add_cash_table_input"  required/>
                                                </div>
                                                )}
                                            />
                                            </>
                                            :
                                            <>
                                            <input  value={this.state.ProductData[0].product_name} onClick={()=>this.handleClickOpenDialog()} className="add_cash_table_input"/>
                                            <Dialog  open={this.state.openDialog} onClose={()=>this.handleCloseDialog()} fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                                    <DialogTitle id="alert-dialog-title">{"اختر المنتج"}</DialogTitle>
                                                    <DialogContent>
                                                        <Autocomplete  sx={{ display: 'inline-block', width:'100%' ,'& input': {bgcolor: 'background.paper', color: (theme) => theme.palette.getContrastText(theme.palette.background.paper)}}}
                                                                id="custom-input-demo"
                                                                //inputValue={this.state.product_name}
                                                                onInputChange={(e, value) => {this.SelectProductName(e,index,value);this.handleCloseDialog()}}
                                                                getOptionLabel={(option) => option.product_name}
                                                                options={this.state.Products}
                                                                renderOption={(props, option) => (
                                                                   <div  onClick={(e)=> this.AutoPrice(index,option.product_price,option.quantity)}>
                                                                    <Box component="li" {...props} key={option.id}>
                                                                        {option.product_name}
                                                                    </Box>
                                                                   </div>
                                                                )}
                                                                renderInput={(params) => (
                                                                <div ref={params.InputProps.ref}>
                                                                        <TextField fullWidth type="text" {...params.inputProps} className="add_cash_table_input"  required/>
                                                                </div>
                                                                )}
                                                            />
                                                    </DialogContent>
                                            </Dialog>
                                            </>
                                        }
                                    </td>
                                    <td className="table_td add_cash_td"><input className="add_cash_table_input" type="number" name="product_price" value={item.product_price} onChange={(e)=>this.handleChange(e,index)}  placeholder="سعر القطعة" autoComplete="off" required/></td>
                                    <td className="table_td add_cash_td"><input className="add_cash_table_input" type="number" name="quantity" value={item.quantity} onChange={(e)=>this.handleChange(e,index)}  placeholder="الكمية" autoComplete="off" required/></td>
                                    <td className="table_td add_cash_td"><input className="add_cash_table_input" type="number" name="total_price" value={item.total_price} onChange={(e)=>this.handleChange(e,index)}  placeholder="الاجمالي" disabled autoComplete="off" required/></td>
                                    <td className="table_td add_cash_td"><button className="addCashTable_btn" id="add_row_btn" onClick={this.AddRow}>اضافة</button></td>
                                    {this.state.ProductData.length > 1 ?
                                    <td className="table_td add_cash_td"><button className="addCashTable_btn" id="remove_row_btn" onClick={(e)=>this.RemoveRow(e,index)}>حذف</button></td>
                                    :
                                    <td className="table_td add_cash_td"><button className="addCashTable_btn" disabled onClick={(e)=>this.RemoveRow(e,index)}>حذف</button></td>
                                    }
                                </tr>
                                )}
                            </tabel>
                        </div>
                    </div>
                </div>

                <div className="Section add_cash_form_bottom">
                    <div className="delete_all_btn_div">
                            {this.state.ProductData.length > 1 ? 
                            <button variant="contained" id="delete_all_rows_btn" onClick={()=>this.DeletAllRows()}>حذف الكل</button>
                            :
                            <button disabled style={{background:'#f7f7f7',color:'#7e7e7e',border:'none'}} variant="contained" id="delete_all_rows_btn" onClick={()=>this.DeletAllRows()}>حذف الكل</button>
                            }
                    </div>
                    <div className="add_cash_form_bottom_li_overall_price">
                        <label className="add_cash_total_price_label">السعر الكلي</label>
                        <input disabled type="number" name="overall_price" value={this.state.overall_price}className="totaL_price_input"/>
                    </div>

                    <div className="add_cash_form_bottom_li" id="btns_div">
                        <div className="submit_btn_div">
                            <button variant="contained" id="submit_btn" type="submit">حفظ</button>
                        </div>
                    </div>
                </div>
                {this.state.loading ? 
                    <div id="Loading_Dialog">
                        <div className="spinner_container">
                            <div className="spinner spinner-circle"></div>
                        </div> 
                    </div>
                : ''}
                <div className={this.state.success_msg ? "Success_Dialog_hidden Success_Dialog_show" : "Success_Dialog_hidden"}>تم الاضافة بنجاح !</div>
            </form>
            </div>
        )
    }
}

