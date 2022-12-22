import React, { Component } from 'react'
import axios from 'axios';
import { data } from './../../../Context/Context';
import GoBack from './../../components/Back';
import HeaderMenu from './../../components/HeaderMenu';
import {FiMinusCircle} from 'react-icons/fi'
import {BsTrash,BsPlusCircle} from 'react-icons/bs'
import './css/add_buyings.css';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import arLocale from "date-fns/locale/ar-EG";
import jwt_decode from "jwt-decode";

const localeMap = {
  ar: arLocale,
};
export default class AddOutBuyings extends Component {
    static contextType = data
    constructor(props) {
        super(props)
    
        this.state = {
            branchname:jwt_decode(localStorage.getItem('token')).branchname,
            auth:jwt_decode(localStorage.getItem('token')).authority,
            locale:'ar',
            date:new Date(),
            Products:[],
            avail:false,
            Data:[{product_id:'',date:new Date().toLocaleDateString('fr-CA'), branch:jwt_decode(localStorage.getItem('token')).branchname, dealer:'', get_qnty:0 ,quantity:0, avail_qnty:0 ,product_name:'', product_price:null, overall_price:0, code:'', notes:'',avail:false}],
            matches: window.matchMedia("(min-width: 950px)").matches,
            matches2: window.matchMedia("(min-width: 850px)").matches,
            success_msg:false,
            loading:false,
            branches:[]
        }
    }

/*
InputFocus = (e,index)=>{
    if(e.target.value == 0){
        var arr = [...this.state.Data];
        arr[index]['quantity']=1
        arr[index]['product_price']=' '
        this.setState({Data:arr},()=>{console.log(this.state.Data);})
    }
}
*/

/*-----------------------------Product Name-----------------------------------*/
HandleProductName = (e,index,value)=>{
    const list = [...this.state.Data]
    list[index]['product_name'] = value
    list[index]['avail'] = false
    this.setState({
        Data:list,
    })
}
ProductNameClick = (e,index,id,qnty,p)=>{
    const list = [...this.state.Data]
    list[index]['avail'] = true
    list[index]['product_id'] = id
    list[index]['avail_qnty'] = qnty
    list[index]['product_price'] = p
    list[index]['get_qnty'] = qnty
    this.setState({
        Data:list,
    })
}




handleChange =(e,index)=>{
    const list = [...this.state.Data]
    list[index][e.target.name] = e.target.value
    list[index]['overall_price'] = Number(list[index]['product_price']) * Number(list[index]['get_qnty'])
    this.setState({
        Data:list
    },()=>{
        list[index]["quantity"] = Number(list[index]['get_qnty']) + Number(list[index]['avail_qnty'])
        })
}

AddRow = () => {
    this.setState({
        Data:[...this.state.Data,{product_id:'',date:new Date().toLocaleDateString('fr-CA'), branch:jwt_decode(localStorage.getItem('token')).branchname, dealer:'', get_qnty:0, quantity:0, avail_qnty:null, product_name:'', product_price:null, overall_price:0, code:'', notes:'',avail:false}]
    })
};
RemoveRow = (e,index)=>{
    e.preventDefault();
    const list = [...this.state.Data]
    list.splice(index,1)

    this.setState({
        Data:list,
    })
}

SubmitData = async (e)=>{
    e.preventDefault()
    this.setState({ loading:true})
    var buyings = this.state.Data.map(({date,branch,dealer,get_qnty,product_name,product_price,overall_price,code,notes}) => [date,branch,dealer,get_qnty,product_name,product_price,overall_price,code,notes]);
    const Insert = this.state.Data.filter((item)=>{return item.avail == false}).map(({branch,quantity,product_name,product_price,code}) => [branch,quantity,product_name,product_price,code]);
     const Update = this.state.Data.filter((item,key)=>{return item.avail != false}).map(function(item) { 
        delete item.date; 
        delete item.dealer; 
        delete item.get_qnty; 
        delete item.avail_qnty; 
        delete item.overall_price; 
        delete item.notes; 
        delete item.avail; 
        return item; 
    });
    const data = {buyings:buyings,ins:Insert,up:Update}
    await axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/add-out-buyings`,data,{
    headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        this.setState({
            Data:[{product_id:'',date:new Date().toLocaleDateString('fr-CA'), branch:jwt_decode(localStorage.getItem('token')).branchname, dealer:'', get_qnty:0 ,quantity:0, avail_qnty:0 ,product_name:'', product_price:'', overall_price:0, code:'', notes:'',avail:false}],
            loading:false,
            success_msg:true,
        })
        setTimeout(() => {
            this.setState({success_msg:false})
        }, 1500);
    })
}


/*----------------------Leashed-------------------------*/
HandleMedia = ()=>{
    const handler = (e) => this.setState({matches: e.matches});
    window.matchMedia("(min-width: 950px)").addEventListener('change', handler);
}
HandleMedia2 = ()=>{
    const handler2 = (e) => this.setState({matches2: e.matches});
    window.matchMedia("(min-width: 850px)").addEventListener('change', handler2);
}
componentDidUpdate(prevState) { 
    if (prevState.navHidden !== this.context.navHidden) {this.context.setNavHidden(true)}
    if (prevState.matches !== this.state.matches) {
        this.HandleMedia()
    }
    if (prevState.matches2 !== this.state.matches2) {
        this.HandleMedia2()
    }
}

GetProductsMenu = ()=>{
    this.context.setNavHidden(true)
    const body ={ branch:this.state.branchname }
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/out-products-select',body)
    .then((response)=>{
        this.setState({Products:response.data.result})
    })
}

componentDidMount(){
    this.GetProductsMenu()
    if(this.state.auth ==='admin'){
        axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/branches')
        .then((response)=>{
            const x = response.data.branches.filter((el)=>{return  el.branch_name !='الكل'})
            const obj = {'branch_name':''};
            this.setState({branches:[ obj, ...x]})
        })
    }
}
HandleBranch = (e)=>{
    setTimeout(() => { this.setState({Data:[{product_id:'',date:new Date().toLocaleDateString('fr-CA'), branch:'', dealer:'', get_qnty:0 ,quantity:0, avail_qnty:0 ,product_name:'', product_price:null, overall_price:0, code:'', notes:'',avail:false}],}) }, 100);
    const arr = this.state.Data
    arr[0]['branch']=e.target.value
    this.setState({
        Data:arr,
        branchname:e.target.value
    },()=>{console.log(this.state.Data);})
     setTimeout(() => {this.GetProductsMenu() }, 100);
}
    render() {
        return (
             <div className="Page_Container">
                <div className="Page_Header">
                    <GoBack/>
                     {!this.state.matches && <HeaderMenu/>}
                     <div className="Header_word">اضافة منتجات خارجية </div>
                </div>

                <div className="Buyings_Packet_container">
                    <div className="add_buyings_date_header">
                    <label className="add_buyings_date_header_label">التاريخ</label>
                        <LocalizationProvider locale={localeMap[this.state.locale]} dateAdapter={AdapterDateFns}>
                            <MobileDatePicker id="add_cash_date_picker"  value={this.state.date}  onChange={(newValue) => {this.setState({date:newValue.toLocaleDateString('fr-CA')}) }} /*onClick={SubmitSearch}*/
                            renderInput={(params) =>
                            <div ref={params.InputProps.ref} className="DatePickerIcon_content">
                                <label {...params.InputLabelProps} className="DatePickerIcon_label">
                                    <div><MdOutlineDateRange className="DatePickerIcon"/></div>
                                    <div><input  {...params.inputProps} className="add_cash_table_input" /></div>
                                </label>
                            </div>
                            }/>
                        </LocalizationProvider>
                        {this.state.auth === 'admin' &&
                        <>
                         <label className="add_cash_input_label">الفرع</label>
                         <select name="branch_name" id="add_cash_select_branch" className="add_cash_input" value={this.state.branchname} onChange={(e)=>{this.HandleBranch(e)}} className="filter_option">
                            {this.state.branches.map((item,key)=>
                                <option value={`${item.branch_name}`}>{item.branch_name}</option>
                            )}
                        </select>
                        </>
                        }
                    </div>
                <form onSubmit={this.SubmitData}>
                    <table id="table_id">
                    {this.state.matches2 && 
                        <tr className="table_tr_head">
                            <th className="table_th">اسم التاجر</th>
                            <th className="table_th">المنتج</th>
                            <th className="table_th">السعر</th>
                            <th className="table_th">الكمية</th>
                            <th className="table_th">الاجمالي</th>
                            <th className="table_th">الكود</th>
                            <th className="table_th">الملاحظات</th>
                            <th className="table_th">اضافة</th>
                            <th className="table_th">حذف</th>
                        </tr>
                    }
                        {this.state.Data.map((item,index)=>
                            <tr className="table_tr " key={index+1}  >  
                                <td className="table_td add_buyings_td"><input  type="text" name="dealer" value={item.dealer} onChange={(e)=>this.handleChange(e,index)} className="add_Buyings_input"/></td>
                                <td className="table_td add_buyings_td">    
                                 <Autocomplete  sx={{ display: 'inline-block', width:'100%' ,'& input': {
                                                bgcolor: 'background.paper', color: (theme) =>
                                                theme.palette.getContrastText(theme.palette.background.paper),
                                            }}}
                                            id="custom-input-demo"
                                            freeSolo
                                            
                                            onInputChange={(e,newValue)=>{this.HandleProductName(e,index,newValue); this.setState({avail:false}) }}
                                            getOptionLabel={(option) => option.product_name}
                                            options={this.state.Products}
                                            renderOption={(props, option) => (
                                                <div onClick={(e)=> this.ProductNameClick(e,index,option.product_id,option.quantity,option.product_price)}>
                                                    <Box component="li"  {...props} key={option.product_id}>
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
                                </td>
                                <td className="table_td add_buyings_td"><input  type="number" name="product_price" value={item.product_price} onChange={(e)=>this.handleChange(e,index)} /*onFocus={(e)=>this.InputFocus(e,index)}*/ className="add_Buyings_input" required/></td>
                                <td className="table_td add_buyings_td"><input  type="number" name="get_qnty" value={item.get_qnty} onChange={(e)=>this.handleChange(e,index)} className="add_Buyings_input" required/></td>
                                <td className="table_td add_buyings_td"> <input  type="number" name="overall_price" value={item.overall_price} onChange={(e)=>this.handleChange(e,index)} className="add_Buyings_input" required/></td>
                                <td className="table_td add_buyings_td"><input rows="1"  type="text" name="code" value={item.code} onChange={(e)=>this.handleChange(e,index)} className="add_Buyings_input" required/></td>
                                <td className="table_td add_buyings_td"><textarea rows="1"  type="text" name="notes" value={item.notes} onChange={(e)=>this.handleChange(e,index)} className="add_Buyings_input" required/></td>
                                <td className="table_td add_buyings_td">{this.state.Data.length - 1 === index && <div className="btns_lines_control btn_add" onClick={this.AddRow}><BsPlusCircle/></div>}</td>
                                <td className="table_td add_buyings_td">{this.state.Data.length !== 1 && <div className="btns_lines_control btn_remove" onClick={(e)=>this.RemoveRow(e,index)}><FiMinusCircle/></div>}</td>
                            </tr>
                        )} 
                    </table>
                    <div className="add_buyings_form_bottom_li" id="add_buyings_submit_btn_div">
                        <div className="submit_btn_div">
                            <button variant="contained" id="submit_btn"  type="submit">حفظ</button>
                        </div>
                   </div>
                </form>
                {this.state.loading ? 
                    <div id="Loading_Dialog">
                        <div className="spinner_container">
                            <div className="spinner spinner-circle"></div>
                        </div> 
                    </div>
                : ''}
                <div className={this.state.success_msg ? "Success_Dialog_hidden Success_Dialog_show" : "Success_Dialog_hidden"}>تم الاضافة بنجاح !</div>
                </div>
              
            </div>
        )
    }
}
