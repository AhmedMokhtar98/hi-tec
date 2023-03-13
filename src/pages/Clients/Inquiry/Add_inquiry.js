import React, { Component } from 'react'
import '../css/add_inquiry.css';
import axios from 'axios';
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import {FiPrinter} from 'react-icons/fi'
import { data } from './../../../Context/Context';
import GoBack from './../../components/Back';
import HeaderMenu from './../../components/HeaderMenu';
import arLocale from "date-fns/locale/ar-EG";
import jwt_decode from "jwt-decode";
import ReactToPrint from 'react-to-print';

const localeMap = {
  ar: arLocale,
};
const Pop = props => {
  const { ...rest } = props
  return <div {...rest} style={{
    background:'black',
    zIndex: 9999,
  }} />
}
export default class Add_inquiry extends Component {
    static contextType = data
    constructor(props) {
        super(props)
    
        this.state = {
            locale:'ar',
            date:new Date().toLocaleDateString('fr-CA'),
            branchName: jwt_decode(localStorage.getItem('token')).branchname,
            auth:jwt_decode(localStorage.getItem('token')).authority,
            data:[{
                 username:'',nickname:'',nat_id:null,address:'',housing_contract:'',service_reciept:'',phone_number:null,job:'',salary:null,work_address:'',pre_cost:25, inq_writer:'', inq_tester:'',
                 username_1:'',nickname_1:'',relationship_1:'',nat_id_1:null,address_1:'',housing_contract_1:'', service_reciept_1:'',phone_number_1:null, job_1:'',salary_1:null,work_address_1:'',
                 username_2:'',nickname_2:'',relationship_2:'',nat_id_2:null,address_2:'',housing_contract_2:'',service_reciept_2:'',phone_number_2:null,job_2:'',salary_2:null,work_address_2:'',
            }],

            product_name:'',
            product_price:null,
            prepaid:null,
            premium:null,
            period:6,
            total_price:null,

            prepaid_auto: false,
            matches: window.matchMedia("(min-width: 850px)").matches,
            success_msg:false,
            faild_msg:false,
            res_message:'',
            loading:false,
            Products:[],
            branches:[]
        }
    }

SelectProductName = (e,value)=>{
    this.setState({
        product_name:value,
    },()=>{this.useEffect()})
}


 AutoPrice = (product_price)=>{
        this.setState({
            product_price:product_price
        })
 }

handleChange = (e)=>{
    if(e.target.name==="nat_id" || e.target.name==="nat_id_1" || e.target.name==="nat_id_2" || e.target.name==="phone_number" || e.target.name==="phone_number_1" || e.target.name==="phone_number_2" ){
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
        const list = [...this.state.data]
        list[0][e.target.name]=e.target.value
        const result1 = this.state.data.map(({username_1,nickname_1,relationship_1,nat_id_1,address_1,housing_contract_1, service_reciept_1,phone_number_1, job_1,salary_1,work_address_1}) => [username_1,nickname_1,relationship_1,nat_id_1,address_1,housing_contract_1, service_reciept_1,phone_number_1, job_1,salary_1,work_address_1])
        const result2 = this.state.data.map(({username_2,nickname_2,relationship_2,nat_id_2,address_2,housing_contract_2, service_reciept_2,phone_number_2, job_2,salary_2,work_address_2}) => [username_2,nickname_2,relationship_2,nat_id_2,address_2,housing_contract_2, service_reciept_2,phone_number_2, job_2,salary_2,work_address_2])
        this.setState({
            data:list,
        })
    }
    else{
        const list = [...this.state.data]
        list[0][e.target.name]=e.target.value
        const result1 = this.state.data.map(({username_1,nickname_1,relationship_1,nat_id_1,address_1,housing_contract_1, service_reciept_1,phone_number_1, job_1,salary_1,work_address_1}) => [username_1,nickname_1,relationship_1,nat_id_1,address_1,housing_contract_1, service_reciept_1,phone_number_1, job_1,salary_1,work_address_1])
        const result2 = this.state.data.map(({username_2,nickname_2,relationship_2,nat_id_2,address_2,housing_contract_2, service_reciept_2,phone_number_2, job_2,salary_2,work_address_2}) => [username_2,nickname_2,relationship_2,nat_id_2,address_2,housing_contract_2, service_reciept_2,phone_number_2, job_2,salary_2,work_address_2])
        this.setState({
            data:list,
        })
    }
}


handlePrePaid = (e)=>{
    this.setState({
        prepaid_auto:!this.state.prepaid_auto,
    },()=>{this.useEffect()})
}



handlePayment = (e)=>{
    if(e.target.name == 'prepaid'){this.setState({prepaid:e.target.value})}
    this.setState({
        [e.target.name]:e.target.value
    },()=>{this.useEffect()})
}

useEffect = ()=>{
        const {product_price,prepaid_auto,prepaid,premium,period} = this.state
        var x1 =  Number(product_price) + (Number(product_price) * 0.02) // سعر المنتج + 0.2
        

        
        if(!prepaid_auto){// لو اوتوماتيك
            
            var advance = Math.round(x1 * 0.20/5)*5 // المقدم مفروض يتدفع
            this.setState({prepaid:advance})
            var x2 =  x1 - advance
            if(period == 3){var X = x2 + x2 * 0.15;     var qst = X/3; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 6){var X = x2 + x2 * 0.30;     var qst = X/6; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 9){var X = x2 + x2 * 0.45;     var qst = X/9; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 12){ X = x2 + x2 * 0.60;  qst = X/12; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
            else if(period == 18){ X = x2 + x2 * 0.90;  qst = X/18; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
            else if(period == 24){ X = x2 + x2 * 1.2;   qst = X/24; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
        }
        else if(prepaid_auto){// لو مقدم متغير
             x2 =  x1 - prepaid
            if(period == 3){ X = x2 + x2 * 0.15;        qst = X/3; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 6){ X = x2 + x2 * 0.30;        qst = X/6; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 9){ X = x2 + x2 * 0.45;        qst = X/9; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 12){ X = x2 + x2 * 0.60;  qst = X/12; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
            else if(period == 18){ X = x2 + x2 * 0.90;  qst = X/18; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
            else if(period == 24){ X = x2 + x2 * 1.2;   qst = X/24; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
        }
        else if(prepaid == 0){ // لو مفيش مقدم
            if(period == 3){ X = x1 + x1 * 0.15 ;       qst = X/3; this.setState({ total_price: X, premium: Math.round(qst) })}
            else if(period == 6){ X = x1 + x1 * 0.30 ;       qst = X/6; this.setState({ total_price: X, premium: Math.round(qst) })}
            else if(period == 9){ X = x1 + x1 * 0.45 ;       qst = X/9; this.setState({ total_price: X, premium: Math.round(qst) })}
            else if(period == 12){ X = x1 + x1 * 0.60; qst = X/12; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 18){ X = x1 + x1 * 0.90;  qst = X/18; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
            else if(period == 24){ X = x1 + x1 * 1.2;   qst = X/24; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
        }
    
}
Submit = async (e)=>{
    e.preventDefault();
    if(this.state.premium > this.state.data[0]['salary']){alert("قيمة القسط اكبر من الراتب")}
    else{
    this.setState({loading:true})
    const userData = Object.assign({}, ...this.state.data);
    const merge = Object.assign({
    "product_name":this.state.product_name,
    "product_price":this.state.product_price,
    "prepaid":this.state.prepaid,
    "premium":this.state.premium,
    "period":this.state.period,
    "total_price":this.state.total_price,
    "date":this.state.date,
    "branch":this.state.branchName,
    "status":'pending'
    }, userData);
    //const y = [merge]
    //const x = y.map(({username ,nickname ,nat_id ,address ,housing_contract ,service_reciept ,phone_number ,job ,salary ,work_address ,pre_cost,username_1 ,nickname_1 ,relationship_1 ,nat_id_1 ,address_1 ,housing_contract_1 , service_reciept_1 ,phone_number_1 , job_1 ,salary_1 ,work_address_1 ,username_2 ,nickname_2 ,relationship_2 ,nat_id_2 ,address_2 ,housing_contract_2 ,service_reciept_2 ,phone_number_2 ,job_2 ,salary_2 ,work_address_2,product_name,product_price,prepaid,premium,period,total_price,date,branch,status})=>[username ,nickname ,nat_id ,address ,housing_contract ,service_reciept ,phone_number ,job ,salary ,work_address ,pre_cost,username_1 ,nickname_1 ,relationship_1 ,nat_id_1 ,address_1 ,housing_contract_1 , service_reciept_1 ,phone_number_1 , job_1 ,salary_1 ,work_address_1 ,username_2 ,nickname_2 ,relationship_2 ,nat_id_2 ,address_2 ,housing_contract_2 ,service_reciept_2 ,phone_number_2 ,job_2 ,salary_2 ,work_address_2,product_name,product_price,prepaid,premium,period,total_price,date,branch,status])
    const body = {data:merge}
    await axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/add-inquiry-2',body,{
        headers:{"x-access-token":localStorage.getItem('token')}
    }).then((response)=>{
        if(response.data.success_msg.length>0){ this.setState({success_msg:true, res_message:response.data.success_msg,}) }
        if(response.data.faild_msg.length>0){ this.setState({faild_msg:true, res_message:response.data.faild_msg,}) }
        this.setState({
            loading:false,
            data:[{username:'',nickname:'',nat_id:null,address:'',housing_contract:'',service_reciept:'',phone_number:null,job:'',salary:null,work_address:'',pre_cost:25, inq_writer:'', inq_tester:'', username_1:'',nickname_1:'',relationship_1:'',nat_id_1:null,address_1:'',housing_contract_1:'', service_reciept_1:'',phone_number_1:null, job_1:'',salary_1:null,work_address_1:'',username_2:'',nickname_2:'',relationship_2:'',nat_id_2:null,address_2:'',housing_contract_2:'',service_reciept_2:'',phone_number_2:null,job_2:'',salary_2:null,work_address_2:'', }],
            product_name:"",
            product_price:null,
            prepaid:null,
            premium:null,
            period:6,
            total_price:null,
            prepaid_auto: false,
        })
        setTimeout(() => {
            this.setState({success_msg:false, faild_msg:false})
        }, 1500);
        // setTimeout(() => {
        //     window.location.reload()
        // }, 2000);
    })
    e.target.reset();
    }
}

HandleMedia = ()=>{
    const handler = (e) => this.setState({matches: e.matches});
    window.matchMedia("(min-width: 850px)").addEventListener('change', handler);
}
componentDidUpdate(prevState) { 
    if (prevState.matches !== this.state.matches) {this.HandleMedia()}
    if (prevState.navHidden !== this.context.navHidden) {this.context.setNavHidden(true)}
}
componentDidMount(){ 
    this.context.setNavHidden(true)
    const body ={ branch:this.state.branchName }
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/products-select-2',body)
    .then((response)=>{
        this.setState({Products:response.data.result})
    })
}

ProductsMenu = ()=>{
    this.context.setNavHidden(true)
    const body ={ branch:this.state.branchName }
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/products-select-2',body)
    .then((response)=>{
        this.setState({Products:response.data.result})
    })
}

getBranches = ()=>{
    axios.get('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/branches-2',{
        headers:{"x-access-token":localStorage.getItem('token')}
    })
    .then((response)=>{
        const x = response.data.branches.filter((el)=>{return  el.branch_name !='الكل'})
        const obj = {'branch_name':''};
        this.setState({branches:[ obj, ...x]},()=>{console.log(this.state.branches);})
    })
}
componentDidMount(){
    this.getBranches()
    this.context.setNavHidden(true)
    const body ={ branch:this.state.branchName }
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
                     <div className="Header_word">اضافة استمارة استعلام </div>
                </div>
                <ReactToPrint  bodyClass="printing" trigger={() => { return <button className="print_button"><FiPrinter/> طباعة</button>; }} content={() => this.componentRef} pageStyle="print" documentTitle="بيان استعلام" />
                   <form  onSubmit={this.Submit} className="Adding_inq_form_container" >
                    <div ref={el => (this.componentRef = el)} className="add_inq_Sections" id="Client_Data_Sections_inq">
                          <div className="add_inq_Sections_Rows" id ="add_inquiry_main_header_data">
                                        <div className="add_inq_displayflex">
                                            <h3 className="add_inq_section_headers"> كاتب الاستعلام</h3>
                                            <input type="text" name="inq_writer" value={this.state.data[0].inq_writer} onChange={(e)=>this.handleChange(e)}  className="inq_Input inq_Input_head" required/> 
                                        </div>
                                        <div className="add_inq_displayflex">
                                            <h3 className="add_inq_section_headers">معرض</h3>
                                            {this.state.auth ==='admin' ? 
                                                <select name="branch_name" id="add_cash_select_branch" className="add_cash_input" value={this.state.branchName} onChange={(e)=>{this.setState({branchName:e.target.value}); setTimeout(() => {this.ProductsMenu() }, 100);}} className="filter_option" required>
                                                    {this.state.branches.map((item,key)=>
                                                        <option value={`${item.branch_name}`}>{item.branch_name}</option>
                                                    )}
                                                </select>
                                            :
                                                <select name="branch_name" id="add_cash_select_branch" className="add_cash_input" value={this.state.branchName} onChange={(e)=>{this.setState({branchName:e.target.value}); setTimeout(() => {this.ProductsMenu() }, 100);}} className="filter_option">
                                                    <option value={`${this.state.branchName}`}>{this.state.branchName}</option>
                                                </select>
                                            }
                                        </div>
                                        <div className="add_inq_displayflex">
                                            <h3 className="add_inq_section_headers">التاريخ</h3>
                                                <LocalizationProvider locale={localeMap[this.state.locale]} dateAdapter={AdapterDateFns}>
                                                    <MobileDatePicker id="date_picker"  value={this.state.date}  onChange={(newValue) => {this.setState({date:newValue.toLocaleDateString('fr-CA')}) }} /*onClick={filterData}*/
                                                    renderInput={(params) =>
                                                    <div ref={params.InputProps.ref} className="add_inquiry_DatePickerIcon">
                                                        <label {...params.InputLabelProps} > 
                                                            <input value={this.state.date} {...params.inputProps}  className="inq_Input inq_Input_head"/>
                                                        </label>
                                                    </div>
                                                    }/>
                                                </LocalizationProvider>
                                        </div>
                                        <div className="add_inq_displayflex">
                                            <h3 className="add_inq_section_headers">تكلفة الاستمارة</h3>
                                            <input type="number" name="pre_cost" value={this.state.data[0].pre_cost} onChange={(e)=>this.handleChange(e)}  className="inq_Input inq_Input_head" required/> جنية
                                        </div>
                          </div>
                        <div className="add_inq_Sections_Rows">
                            <h3 className="add_inq_section_headers">بيانات العميل</h3>
                            <div className="Section_splite_row_inq">
                                <div className="Input_Section_inq">
                                    <label className="inq_label">اسم العميل</label>
                                    <input type="text" name="username" value={this.state.data[0].username} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اسم العميل" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label">الشهرة </label>
                                    <input type="text" name="nickname" value={this.state.data[0].nickname} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اسم الشهرة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> رقم البطاقة</label>
                                    <input type="number" name="nat_id" value={this.state.data[0].nat_id} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب رقم البطاقة" autoComplete="off" maxLength={14} required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> العنوان</label>
                                    <input type="text" name="address" value={this.state.data[0].address} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب العنوان" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> عقد السكن</label>
                                    <input type="text" name="housing_contract" value={this.state.data[0].housing_contract} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب عقد السكن" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> ايصال الخدمة</label>
                                    <input type="text" name="service_reciept" value={this.state.data[0].service_reciept} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب ايصال الخدمة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> التليفون</label>
                                    <input type="number" name="phone_number" value={this.state.data[0].phone_number} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب رقم الهاتف" autoComplete="off" maxLength={11} required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> الوظيفة</label>
                                    <input type="text" name="job" value={this.state.data[0].job} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب الوظيفة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> اجمالي الدخل</label>
                                    <input type="number" name="salary" value={this.state.data[0].salary} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اجمالي الدخل" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> عنوان العمل</label>
                                    <input type="text" name="work_address" value={this.state.data[0].work_address} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب عنوان العمل" autoComplete="off" required/>
                                </div>
                            </div>
                        </div>
                        {/*--------------------------1 بيانات الضامن--------------------------*/}
                        <div className="add_inq_Sections_Rows">
                            <h3 className="add_inq_section_headers"> بيانات الضامن الأول</h3>
                            <div className="Section_splite_row_inq">
                                <div className="Input_Section_inq">
                                    <label className="inq_label">اسم العميل</label>
                                    <input type="text" name="username_1" value={this.state.data[0].username_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اسم العميل" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label">الشهرة </label>
                                    <input type="text" name="nickname_1" value={this.state.data[0].nickname_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اسم الشهرة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label">القرابة </label>
                                    <input type="text" name="relationship_1" value={this.state.data[0].relationship_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اسم الشهرة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> رقم البطاقة</label>
                                    <input type="number" name="nat_id_1" value={this.state.data[0].nat_id_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب رقم البطاقة" autoComplete="off" maxLength={14} required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> العنوان</label>
                                    <input type="text" name="address_1" value={this.state.data[0].address_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب العنوان" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> عقد السكن</label>
                                    <input type="text" name="housing_contract_1" value={this.state.data[0].housing_contract_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب عقد السكن" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> ايصال الخدمة</label>
                                    <input type="text" name="service_reciept_1" value={this.state.data[0].service_reciept_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب ايصال الخدمة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> التليفون</label>
                                    <input type="number" name="phone_number_1" value={this.state.data[0].phone_number_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب رقم الهاتف" autoComplete="off" maxLength={11} required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> الوظيفة</label>
                                    <input type="text" name="job_1" value={this.state.data[0].job_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب الوظيفة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> اجمالي الدخل</label>
                                    <input type="number" name="salary_1" value={this.state.data[0].salary_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اجمالي الدخل" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> عنوان العمل</label>
                                    <input type="text" name="work_address_1" value={this.state.data[0].work_address_1} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب عنوان العمل" autoComplete="off" required/>
                                </div>
                            </div>
                        </div>
                        <div className="second_garantee_notice">سيتم تفعيل الضامن الثاني في حالة زيادة الاجمالي عن 8000 جنية</div>
                        {/*--------------------------2 بيانات الضامن--------------------------*/}
                        {this.state.total_price > 8000 &&
                        <div className="add_inq_Sections_Rows">
                            <h3 className="add_inq_section_headers"> بيانات الضامن الثاني</h3>
                            <div className="Section_splite_row_inq">
                                <div className="Input_Section_inq">
                                    <label className="inq_label">اسم العميل</label>
                                    <input type="text" name="username_2" value={this.state.data[0].username_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اسم العميل" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label">الشهرة </label>
                                    <input type="text" name="nickname_2" value={this.state.data[0].nickname_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اسم الشهرة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label">القرابة </label>
                                    <input type="text" name="relationship_2" value={this.state.data[0].relationship_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اسم الشهرة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> رقم البطاقة</label>
                                    <input type="number" name="nat_id_2" value={this.state.data[0].nat_id_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب رقم البطاقة" autoComplete="off" maxLength={14} required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> العنوان</label>
                                    <input type="text" name="address_2" value={this.state.data[0].address_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب العنوان" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> عقد السكن</label>
                                    <input type="text" name="housing_contract_2" value={this.state.data[0].housing_contract_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب عقد السكن" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> ايصال الخدمة</label>
                                    <input type="text" name="service_reciept_2" value={this.state.data[0].service_reciept_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب ايصال الخدمة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> التليفون</label>
                                    <input type="number" name="phone_number_2" value={this.state.data[0].phone_number_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب رقم الهاتف" autoComplete="off" maxLength={11} required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> الوظيفة</label>
                                    <input type="text" name="job_2" value={this.state.data[0].job_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب الوظيفة" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> اجمالي الدخل</label>
                                    <input type="number" name="salary_2" value={this.state.data[0].salary_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب اجمالي الدخل" autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label"> عنوان العمل</label>
                                    <input type="text" name="work_address_2" value={this.state.data[0].work_address_2} onChange={(e)=>this.handleChange(e)} className="inq_Input" placeholder="اكتب عنوان العمل" autoComplete="off" required/>
                                </div>
                            </div>
                        </div>
                        }
                        {/*--------------------------ءبيانات الدفع--------------------------*/}
                        <div className="add_inq_Sections_Rows">
                            <h3 className="add_inq_section_headers">بيانات الدفع</h3>
                            <div className="Section_splite_row_inq">
                                <div className="Input_Section_inq">
                                    <label className="inq_label">اسم المنتج</label>
                                    {/* <Autocomplete  PopperComponent={this.state.matches ? '' : Pop}  sx={{ display: 'inline-block', width:'100%' ,'& input': {
                                            bgcolor: 'background.paper', color: (theme) =>
                                            theme.palette.getContrastText(theme.palette.background.paper),
                                        }}}
                                        id="custom-input-demo"
                                        onInputChange={(e, value) => this.SelectProductName(e,value)}
                                        getOptionLabel={(option) => option.product_name}
                                        options={this.state.Products}
                                        renderOption={(props, option) => (
                                            <div onClick={(e)=> this.AutoPrice(option.product_price)}>
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
                                    /> */}
                                    <Autocomplete  sx={{ display: 'inline-block', width:'100%' ,'& input': {
                                                bgcolor: 'background.paper', color: (theme) =>
                                                theme.palette.getContrastText(theme.palette.background.paper),
                                            }}}
                                            id="custom-input-demo"
                                            freeSolo
                                            inputValue={this.state.product_name}
                                            onInputChange={(e, value)=>{this.SelectProductName(e,value) }}
                                            getOptionLabel={(option) => option.product_name}
                                            options={this.state.Products}
                                            renderOption={(props, option) => (
                                                <div onClick={(e)=> this.AutoPrice(option.product_price)}>
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
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label">سعر المنتج </label>
                                    <input type="number" name="product_price" value={this.state.product_price} onChange={(e)=>this.handlePayment(e)} className="inq_Input" placeholder="اكتب سعر المنتج " autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label">المقدم <input type="checkbox" name="prepaid_auto" checked={this.state.prepaid_auto} onChange={(e)=>this.handlePrePaid(e)}/></label>
                                    <input style={{background:`${this.state.prepaid_auto? 'white' : 'rgb(201 201 201 / 32%)'}` }} type="number" disabled={!this.state.prepaid_auto} name="prepaid" value={this.state.prepaid} onChange={(e)=>this.handlePayment(e)} className="inq_Input"  autoComplete="off" required/>
                                </div>
                                <div className="Input_Section_inq">
                                    <label className="inq_label">القسط</label>
                                    <input style={{background:'rgb(201 201 201 / 32%)'}}   type="number" name="premium" value={this.state.premium} onChange={(e)=>this.handlePayment(e)} className="inq_Input" id ="specific_colored" disabled />
                                </div>
                                <div className="Input_Section_inq Select_Section_qst">
                                    <label className="inq_label">المدة</label>
                                    <select name="period" value={this.state.period} onChange={(e)=>this.handlePayment(e)} className="inq_Input" >
                                        <option value="3">3</option>
                                        <option value="6">6</option>
                                        <option value="9">9</option>
                                        <option value="12">12</option>
                                        <option value="18">18</option>
                                        <option value="24">24</option>
                                    </select>
                                </div>
                                <div className="Input_Section_inq" id="Total_qst_price">
                                    <label className="inq_label">الاجمالي</label>
                                    <input disabled type="number" value={this.state.total_price} id="Total_qst_price_input"/>
                                </div>
                            </div>
                            <div className="add_inq_displayflex" >
                            <h3 className="add_inq_section_headers">اسم المستعلم</h3>
                                <input name="inq_tester" type="text" value={this.state.inq_tester} onChange={(e)=>this.handleChange(e)} className="inq_Input"/>
                            </div>
                        </div>
                        {/*-------------------------- حفظ --------------------------*/}
                       
                    </div>
                    <div className="add_qst_bottom_btns_div">   
                        <button type="submit" className="add_qst_bottom_btn" >حفظ</button> 
                    </div>
                </form>
                {this.state.loading ? 
                    <div id="Loading_Dialog">
                        <div className="spinner_container">
                            <div className="spinner spinner-circle"></div>
                        </div> 
                    </div>
                : ''}
                <div className={this.state.success_msg ? "Success_Dialog_hidden Success_Dialog_show" : "Success_Dialog_hidden"}>{this.state.res_message}</div>
                <div className={this.state.faild_msg ? "faild_Dialog_hidden faild_Dialog_show" : "faild_Dialog_hidden"}>{this.state.res_message}</div>
            </div>
        )
    }
}
