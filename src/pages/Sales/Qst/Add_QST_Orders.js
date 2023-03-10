import React, { Component } from 'react'
import './css/add_qst.css';
import axios from 'axios';
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {MdOutlineDateRange} from 'react-icons/md'
import { data } from './../../../Context/Context';
import GoBack from './../../components/Back';
import HeaderMenu from './../../components/HeaderMenu';
import arLocale from "date-fns/locale/ar-EG";
import jwt_decode from "jwt-decode";

const localeMap = {
  ar: arLocale,
};


export default class AddQSTOrders extends Component {
    static contextType = data
    constructor(props) {
        super(props)

        this.state = {
            locale:'ar',
            date:new Date(),
            Qst_date:new Date(),
            branchName:jwt_decode(localStorage.getItem('token')).branchname,
            auth:jwt_decode(localStorage.getItem('token')).authority,
            CodesArray:[],
            Code:'',
            CodeExist:false,
            Clients:[],
            Garantees:[],
            
            Clientdata:[{username:'',nickname:'',nat_id:null,code:'',address:'',housing_contract:'',service_reciept:'',phone_number:null,job:'',salary:null,work_address:''}],
            Garantee_1_data:[{ g_name:'',g_nickname:'',g_nat_id:null,g_relationship:'',g_address:'',g_housing_contract:'',g_service_reciept:'',g_phone_number:null,g_job:'',g_salary:null,g_work_address:''}],
            Garantee_2_data:[{ g_name:'',g_nickname:'',g_nat_id:null,g_relationship:'',g_address:'',g_housing_contract:'',g_service_reciept:'',g_phone_number:null,g_job:'',g_salary:null,g_work_address:''}],
            
            G2_not_exist:false,
            Products:[],
            product_name:'',
            product_price:null,
            prepaid:null,
            premium:null,
            period:6,
            total_price:null,

            QstLoop:[],

            prepaid_auto: false,
            matches: window.matchMedia("(min-width: 950px)").matches,
            loading:false,
            success_msg:false,
            SG1V:null,
            SG2V:null,
            branches:[]

        }
    }



CodeHandle = (e)=>{
this.setState({Code:e.target.value},()=>{
    const check = this.state.CodesArray.some((el)=> el.code == this.state.Code ) 
    this.setState({CodeExist:check},()=>{
    console.log(this.state.CodeExist)
    if(this.state.Code == this.state.Clientdata[0].code){
        this.setState({CodeExist:true})
    }
    })

})
if(e.target.value < 0 ){this.setState({Code:''})}
}

CodeAutoFillHandle = ()=>{
    const check = this.state.CodesArray.some((el)=> el.code == this.state.Code ) 
    this.setState({CodeExist:check},()=>{
    console.log(this.state.CodeExist)
    if(this.state.Code == this.state.Clientdata[0].code){
        this.setState({CodeExist:true})
    }
})
}
/*--------------?????????? ???????????? ????????????????--------------*/
AutoFill = (option)=>{
    this.setState({Clientdata:[option],Code:option.code,CodeExist:false})
    const body = {client_id:option.nat_id}
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/qst-garantees-select-2',body)
    .then((response)=>{
        this.setState({
            SG1V:null,
            SG2V:null,
            Garantees:response.data.result,
            Garantee_1_data:[{ g_name:'',g_nickname:'',g_nat_id:null,g_relationship:'',g_address:'',g_housing_contract:'',g_service_reciept:'',g_phone_number:null,g_job:'',g_salary:null,g_work_address:''}],
            Garantee_2_data:[{ g_name:'',g_nickname:'',g_nat_id:null,g_relationship:'',g_address:'',g_housing_contract:'',g_service_reciept:'',g_phone_number:null,g_job:'',g_salary:null,g_work_address:''}],
        },()=>{this.CodeAutoFillHandle();})
        if(response.data.result.length == 1){ this.setState({ G2_not_exist:true}) }
        else{ this.setState({G2_not_exist:false}) }
    })
}

AutoFillGarantee1 = (option)=>{ this.setState({Garantee_1_data:[option]}) }
AutoFillGarantee2 = (option)=>{ this.setState({Garantee_2_data:[option]}) }
/*--------------?????????? ???????????? ???????????? ?? ???????????????? ??????????????--------------*/
User_HandleChange = (e)=>{
    if(e.target.name==="nat_id" || e.target.name==="nat_id_1" || e.target.name==="nat_id_2" || e.target.name==="phone_number" || e.target.name==="phone_number_1" || e.target.name==="phone_number_2" ){
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
        const list = [...this.state.Clientdata]
        list[0][e.target.name]=e.target.value
        this.setState({
            Clientdata:list,
        })
    }
    else{
        const list = [...this.state.Clientdata]
        list[0][e.target.name]=e.target.value
        this.setState({Clientdata:list})
    }
}

G1_HandleChange = (e)=>{
    if( e.target.name==="nat_id_1" || e.target.name==="phone_number_1" ){
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
        const list = [...this.state.Garantee_1_data]
        list[0][e.target.name]=e.target.value
        this.setState({
            Garantee_1_data:list,
        })
    }
    else{
        const list = [...this.state.Garantee_1_data]
        list[0][e.target.name] = e.target.value
        this.setState({Garantee_1_data:list})
    }
}


G2_HandleChange = (e)=>{
    if( e.target.name==="nat_id_2" || e.target.name==="phone_number_2" ){
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
        const list = [...this.state.Garantee_2_data]
        list[0][e.target.name]=e.target.value
        this.setState({
            Garantee_2_data:list,
        })
    }
    else{
        const list = [...this.state.Garantee_2_data]
        list[0][e.target.name] = e.target.value
        this.setState({Garantee_2_data:list})
    }
}

/*-------------- ???????????? ?????? ???????????? --------------*/

 SelectProductName = (e,value)=>{
    this.setState({
        product_name:value,
    },()=>{this.useEffect()})
}
/*--------------?????? ?????? ???????????? ??????????????????--------------*/
 AutoPrice = (product_price)=>{ this.setState({product_price:product_price }) }

/*--------------????????????  ??????????????--------------*/
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
/*--------------???????? ???????????? ??????????--------------*/

useEffect = ()=>{
        const {product_price,prepaid_auto,prepaid,premium,period} = this.state
        var x1 =  Number(product_price) + (Number(product_price) * 0.02) // ?????? ???????????? + 0.2

        
        if(!prepaid_auto){// ???? ??????????????????
            var advance = Math.floor(x1 * 0.20) // ???????????? ?????????? ??????????
            this.setState({prepaid:advance})
            var x2 =  x1 - advance
            if(period == 3){var X = x2 + x2 * 0.15;     var qst = X/3; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 6){var X = x2 + x2 * 0.30;     var qst = X/6; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 9){var X = x2 + x2 * 0.45;     var qst = X/9; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
            else if(period == 12){ X = x2 + x2 * 0.60;  qst = X/12; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
            else if(period == 18){ X = x2 + x2 * 0.90;  qst = X/18; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
            else if(period == 24){ X = x2 + x2 * 1.2;   qst = X/24; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
        }
        else if(prepaid_auto){// ???? ???????? ??????????
            x2 =  x1 - prepaid
           if(period == 3){ X = x2 + x2 * 0.15;        qst = X/3; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
           else if(period == 6){ X = x2 + x2 * 0.30;   qst = X/6; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
           else if(period == 9){ X = x2 + x2 * 0.45;   qst = X/9; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
           else if(period == 12){ X = x2 + x2 * 0.60;  qst = X/12; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
           else if(period == 18){ X = x2 + x2 * 0.90;  qst = X/18; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
           else if(period == 24){ X = x2 + x2 * 1.2;   qst = X/24; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
       }
       else if(prepaid == 0){ // ???? ???????? ????????
           if(period == 3){ X = x1 + x1 * 0.15 ;       qst = X/3; this.setState({ total_price: X, premium: Math.round(qst) })}
           else if(period == 6){ X = x1 + x1 * 0.30 ;  qst = X/6; this.setState({ total_price: X, premium: Math.round(qst) })}
           else if(period == 9){ X = x1 + x1 * 0.45 ;  qst = X/9; this.setState({ total_price: X, premium: Math.round(qst) })}
           else if(period == 12){ X = x1 + x1 * 0.60;  qst = X/12; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
           else if(period == 18){ X = x1 + x1 * 0.90;  qst = X/18; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 })}
           else if(period == 24){ X = x1 + x1 * 1.2;   qst = X/24; this.setState({ total_price: Math.round(X/5)*5, premium: Math.round(qst/5)*5 }) }
       }
   

}

Submit =(e)=>{
    e.preventDefault();
    this.QstLoop(); //------?????? ???????????? 
    this.setState({loading:true})
    const Qstdata = {
    "code": this.state.Code,
    "nat_id": this.state.Clientdata[0].nat_id,
    "g_nat_id_1": this.state.Garantee_1_data[0].g_nat_id,
    "g_nat_id_2": this.state.Garantee_2_data[0].g_nat_id,
    "product_name":this.state.product_name,
    "product_price":this.state.product_price,
    "prepaid":this.state.prepaid,
    "premium":this.state.premium,
    "period":this.state.period,
    "total_price":this.state.total_price,
    "rest_price":this.state.total_price,
    "date":this.state.date.toLocaleDateString('fr-CA'),
    "branch":this.state.branchName
    };
    const x = Object.assign({}, ...this.state.Garantee_2_data)
    const G2Data = Object.assign({"client_id":this.state.Clientdata[0].nat_id}, x);
    const body ={ data:Qstdata, loop:this.state.QstLoop,addG2:this.state.G2_not_exist,G2Data:G2Data}
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/add-qst-process-2',body)
    .then((response)=>{
            this.setState({loading:false})
            this.setState({success_msg:true})
            this.setState({ 
                QstLoop:[],
                product_price:'',
                prepaid:'',
                premium:'',
                period:6,
                total_price:'',
                Clientdata:[{username:'',nickname:'',nat_id:'',code:'',address:'',housing_contract:'',service_reciept:'',phone_number:'',job:'',salary:'',work_address:''}],
                Garantee_1_data:[{ g_name:'',g_nickname:'',g_nat_id:'',g_relationship:'',g_address:'',g_housing_contract:'',g_service_reciept:'',g_phone_number:'',g_job:'',g_salary:'',g_work_address:''}],
                Garantee_2_data:[{ g_name:'',g_nickname:'',g_nat_id:'',g_relationship:'',g_address:'',g_housing_contract:'',g_service_reciept:'',g_phone_number:'',g_job:'',g_salary:'',g_work_address:''},],
             })
            setTimeout(() => {
                this.setState({success_msg:false})
            }, 1500);
    })
}

QstLoop = ()=>{
    var n = 0  
    for(var i=0; i < this.state.period; i++){
        var x = new Date(this.state.Qst_date);
        x.setMonth(x.getMonth() + n);
        n++
        let {QstLoop,Code,} = this.state
        QstLoop.push([ this.state.Code, this.state.Clientdata[0].username, this.state.Clientdata[0].nat_id, '', this.state.branchName, this.state.premium, x.toLocaleDateString('fr-CA'), null, null, '' ,'','false'])
        this.setState({ QstLoop: QstLoop})
    }
}   

HandleMedia = ()=>{
    const handler = (e) => this.setState({matches: e.matches});
    window.matchMedia("(min-width: 950px)").addEventListener('change', handler);
}
componentDidUpdate(prevState) {
    if (prevState.matches !== this.state.matches) {this.HandleMedia()}
    if (prevState.navHidden !== this.context.navHidden) {this.context.setNavHidden(true)}
}

componentDidMount(){
    this.context.setNavHidden(true)
    axios.get('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/codes-2')
    .then((response)=>{ this.setState({CodesArray:response.data.result}) })

    const data = {branch:this.state.branchName}
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/qst-clients-select-2',data)
    .then((response)=>{ this.setState({Clients:response.data.result},()=>{console.log('clients',this.state.Clients);}) })

    axios.get('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/branches-2',{
        headers:{"x-access-token":localStorage.getItem('token')}
    })
    .then((response)=>{
        const x = response.data.branches.filter((el)=>{return  el.branch_name !='????????'})
        const obj = {'branch_name':''};
        this.setState({branches:[ obj, ...x]},()=>{console.log(this.state.branches)})
        console.log('branches',response.data.branches);
    })
    
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


    render() {
        return (
           <div className="Page_Container">
                <div className="Page_Header">
                    <GoBack/>
                     {!this.state.matches && <HeaderMenu/>}
                     <div className="Header_word">?????????? ?????????? ?????? </div>
                </div>
                <div className="group_info_top">
                        <div className="head_form_info_li">
                            <h3 className="add_qst_section_headers__">?????? ????????????</h3>
                            <input type="text" value={this.state.Code} onChange={(e)=>this.CodeHandle(e)} className="qst_Input qst_Input_header" style={{background:this.state.CodeExist?'rgb(255 75 75 / 52%)':'white'}}/>
                        </div>
                        <div className="head_form_info_li">
                            <h3 className="add_qst_section_headers__">??????????????</h3>
                            <LocalizationProvider locale={localeMap[this.state.locale]} dateAdapter={AdapterDateFns}>
                                <MobileDatePicker inputFormat="yyyy/MM/d" id="date_picker"  value={this.state.date}  onChange={(newValue) => {this.setState({date:newValue.toLocaleDateString('fr-CA')}) }} /*onClick={filterData}*/
                                renderInput={(params) =>
                                <div ref={params.InputProps.ref} className="add_inquiry_DatePickerIcon">
                                    <label {...params.InputLabelProps} > 
                                        <input value={this.state.date} {...params.inputProps}  className="qst_Input qst_Input_header" />
                                    </label>
                                </div>
                                }/>
                            </LocalizationProvider>
                        </div>
                        <div className="head_form_info_li">
                        <label className="add_cash_input_label">??????????</label>
                            {this.state.auth ==='admin' ? 
                                <select name="branch_name" id="add_cash_select_branch" className="add_cash_input" value={this.state.branchName} onChange={(e)=>{this.setState({branchName:e.target.value}); setTimeout(() => {this.ProductsMenu() }, 100);}} className="filter_option" required>
                                    {this.state.branches.map((item,key)=>
                                        <option value={`${item.branch_name}`}>{item.branch_name}</option>
                                    )}
                                </select>
                            :
                                <select name="branch_name" id="add_cash_select_branch" className="add_cash_input" value={this.state.branchName}  className="filter_option" required>
                                    <option value={`${this.state.branchName}`}>{this.state.branchName}</option>
                                </select>
                            }
                        </div>
                </div>
                   <form className="Adding_form_container" onSubmit={(e)=>this.Submit(e)}>
                    <div className="Sections" id="Client_Data_Sections_qst">
                      <div id ="add_qst_main_header_data">
                                <h3 className="add_qst_section_headers_select">???????? ????????????</h3>
                                <div className="add_qst_user_select">
                                    <Autocomplete     sx={{ display: 'inline-block', width:'100%' ,'& input': {
                                        bgcolor: 'background.paper', color: (theme) =>
                                        theme.palette.getContrastText(theme.palette.background.paper),
                                        }}}
                                        id="custom-input-demo"
                                        // onInputChange={(e, value) => this.SelectUser(e,value)}
                                        getOptionLabel={(option) => option.username}
                                        options={this.state.Clients}
                                        renderOption={(props, option) => (
                                            <div onClick={(e)=> this.AutoFill(option)}>
                                                <Box component="li" id="SelectBox" {...props} key={option.id}>
                                                    {option.username}
                                                </Box>
                                            </div>
                                        )}
                                        renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <input   type="text" {...params.inputProps} className="add_qst_table_input" id="select_input"  required/>
                                        </div>
                                        )}
                                    />
                                </div>
                           </div>
                        <div className="Sections__Rows_Qst">
                            <div className="Section_splite_row_qst">
                                <div className="Input_Section_qst">
                                    <label className="qst_label">?????? ????????????</label>
                                    <input type="text" name="username" value={this.state.Clientdata[0].username} onChange={(e)=>this.User_HandleChange(e) }  className="qst_Input"  autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label">???????????? </label>
                                    <input type="text" name="nickname" value={this.state.Clientdata[0].nickname}  onChange={(e)=>this.User_HandleChange(e) }  className="qst_Input"  autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ?????? ??????????????</label>
                                    <input type="text" name="nat_id" value={this.state.Clientdata[0].nat_id}  onChange={(e)=>this.User_HandleChange(e) }  className="qst_Input"   autoComplete="off" maxLength={14}  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ??????????????</label>
                                    <input type="text" name="address" value={this.state.Clientdata[0].address}  onChange={(e)=>this.User_HandleChange(e) }  className="qst_Input" placeholder="???????? ??????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ?????? ??????????</label>
                                    <input type="text" name="housing_contract" value={this.state.Clientdata[0].housing_contract} onChange={(e)=>this.User_HandleChange(e) }   className="qst_Input" placeholder="???????? ?????? ??????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ?????????? ????????????</label>
                                    <input type="text" name="service_reciept" value={this.state.Clientdata[0].service_reciept}  onChange={(e)=>this.User_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????????? ????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ????????????????</label>
                                    <input type="text" name="phone_number" value={this.state.Clientdata[0].phone_number} onChange={(e)=>this.User_HandleChange(e) }   className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off" maxLength={11}  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ??????????????</label>
                                    <input type="text" name="job" value={this.state.Clientdata[0].job}  onChange={(e)=>this.User_HandleChange(e) }  className="qst_Input" placeholder="???????? ??????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ???????????? ??????????</label>
                                    <input type="text" name="salary" value={this.state.Clientdata[0].salary}  onChange={(e)=>this.User_HandleChange(e) }  className="qst_Input" placeholder="???????? ???????????? ??????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ?????????? ??????????</label>
                                    <input type="text" name="work_address" value={this.state.Clientdata[0].work_address}  onChange={(e)=>this.User_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????????? ??????????" autoComplete="off"  required/>
                                </div>
                            </div>
                        </div>
                        {/*--------------------------1 ???????????? ????????????--------------------------*/}
                           <div id ="add_qst_main_header_data">
                                <h3 className="add_qst_section_headers_select">???????? ????????????</h3>
                                <div className="add_qst_user_select">
                                    <Autocomplete     sx={{ display: 'inline-block', width:'100%' ,'& input': {
                                            bgcolor: 'background.paper', color: (theme) =>
                                            theme.palette.getContrastText(theme.palette.background.paper),
                                        }}}
                                        id="custom-input-demo"
                                        onChange={(e, value) => this.setState({SG1V:value})}
                                        value={this.state.SG1V}
                                        getOptionLabel={(option) => option.g_name}
                                        options={this.state.Garantees}
                                        renderOption={(props, option) => (
                                            <div onClick={(e)=> this.AutoFillGarantee1(option)}>
                                                <Box component="li"  {...props} key={option.id}>
                                                    {option.g_name}
                                                </Box>
                                            </div>
                                        )}
                                        renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <input  fullWidth type="text" {...params.inputProps} className="add_qst_table_input"  id="select_input" required/>
                                        </div>
                                        )}
                                    />
                                </div>
                            </div>
                        <div className="Sections__Rows_Qst">
                            <div className="Section_splite_row_qst">
                                <div className="Input_Section_qst">
                                    <label className="qst_label">?????? ????????????</label>
                                    <input type="text" name="g_name" value={this.state.Garantee_1_data[0].g_name}  onChange={(e)=> this.G1_HandleChange(e) } className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label">???????????? </label>
                                    <input type="text" name="g_nickname" value={this.state.Garantee_1_data[0].g_nickname}  onChange={(e)=>this.G1_HandleChange(e) } className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label">?????????????? </label>
                                    <input type="text" name="g_relationship" value={this.state.Garantee_1_data[0].g_relationship}  onChange={(e)=>this.G1_HandleChange(e) } className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ?????? ??????????????</label>
                                    <input type="text" name="g_nat_id" value={this.state.Garantee_1_data[0].g_nat_id}  onChange={(e)=>this.G1_HandleChange(e) } className="qst_Input"   autoComplete="off" maxLength={14}  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ??????????????</label>
                                    <input type="text" name="g_address" value={this.state.Garantee_1_data[0].g_address}  onChange={(e)=>this.G1_HandleChange(e) } className="qst_Input" placeholder="???????? ??????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ?????? ??????????</label>
                                    <input type="text" name="g_housing_contract" value={this.state.Garantee_1_data[0].g_housing_contract}  onChange={(e)=>this.G1_HandleChange(e) } className="qst_Input" placeholder="???????? ?????? ??????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ?????????? ????????????</label>
                                    <input type="text" name="g_service_reciept" value={this.state.Garantee_1_data[0].g_service_reciept}  onChange={(e)=>this.G1_HandleChange(e) } className="qst_Input" placeholder="???????? ?????????? ????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ????????????????</label>
                                    <input type="text" name="g_phone_number" value={this.state.Garantee_1_data[0].g_phone_number} onChange={(e)=>this.G1_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off" maxLength={11}  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ??????????????</label>
                                    <input type="text" name="g_job" value={this.state.Garantee_1_data[0].g_job}  onChange={(e)=>this.G1_HandleChange(e) } className="qst_Input" placeholder="???????? ??????????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ???????????? ??????????</label>
                                    <input type="text" name="g_salary" value={this.state.Garantee_1_data[0].g_salary}  onChange={(e)=>this.G1_HandleChange(e) } className="qst_Input" placeholder="???????? ???????????? ??????????" autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label"> ?????????? ??????????</label>
                                    <input type="text" name="g_work_address" value={this.state.Garantee_1_data[0].g_work_address} onChange={(e)=>this.G1_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????????? ??????????" autoComplete="off"  required/>
                                </div>
                            </div>
                        </div>
                        <div className="second_garantee_notice">???????? ?????????? ???????????? ???????????? ???? ???????? ?????????? ???????????????? ???? 8000 ????????</div>
                        {/*--------------------------2 ???????????? ????????????--------------------------*/}
                        {this.state.total_price > 8000 &&
                        <>
                        {!this.state.G2_not_exist &&
                            <div id ="add_qst_main_header_data">
                                    <h3 className="add_qst_section_headers_select">???????? ???????????? ????????????</h3>
                                    <div className="add_qst_user_select">
                                        <Autocomplete     sx={{ display: 'inline-block', width:'100%' ,'& input': {
                                                bgcolor: 'background.paper', color: (theme) =>
                                                theme.palette.getContrastText(theme.palette.background.paper),
                                            }}}
                                            id="custom-input-demo"
                                            onChange={(e, value) => this.setState({SG2V:value})}
                                            getOptionLabel={(option) => option.g_name}
                                            options={this.state.Garantees}
                                            renderOption={(props, option) => (
                                                <div onClick={(e)=> this.AutoFillGarantee2(option)}>
                                                    <Box component="li"  {...props} key={option.id}>
                                                        {option.g_name}
                                                    </Box>
                                                </div>
                                            )}
                                            renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <input  fullWidth type="text" {...params.inputProps} className="add_qst_table_input" id="select_input"  required/>
                                            </div>
                                            )}
                                        />
                                    </div>
                            </div>
                        }
                        <div className="Sections__Rows_Qst" style={{background:this.state.G2_not_exist ? 'rgba(255, 131, 131, 0.278)':'white'}}>
                            {this.state.G2_not_exist ?
                            <>
                            <div className="notice_no_g2">???? ???????? ???????? ??????!</div>
                            <h3 className="add_qst_section_headers"> ?????? ???????????? ????????????</h3>
                            </>
                            : 
                            ''
                            }
                            <div className="Section_splite_row_qst">
                                    <div className="Input_Section_qst">
                                        <label className="qst_label">?????? ????????????</label>
                                        <input type="text" name="g_name" value={this.state.Garantee_2_data[0].g_name} onChange={(e)=>this.G2_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off"  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label">???????????? </label>
                                        <input type="text" name="g_nickname" value={this.state.Garantee_2_data[0].g_nickname} onChange={(e)=>this.G2_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off"  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label">?????????????? </label>
                                        <input type="text" name="g_relationship" value={this.state.Garantee_2_data[0].g_relationship}  onChange={(e)=>this.G2_HandleChange(e) } className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off"  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label"> ?????? ??????????????</label>
                                        <input type="text" name="g_nat_id" value={this.state.Garantee_2_data[0].g_nat_id} onChange={(e)=>this.G2_HandleChange(e) }  className="qst_Input"   autoComplete="off" maxLength={14}  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label"> ??????????????</label>
                                        <input type="text" name="g_address" value={this.state.Garantee_2_data[0].g_address} onChange={(e)=>this.G2_HandleChange(e) }  className="qst_Input" placeholder="???????? ??????????????" autoComplete="off"  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label"> ?????? ??????????</label>
                                        <input type="text" name="g_housing_contract" value={this.state.Garantee_2_data[0].g_housing_contract} onChange={(e)=>this.G2_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????? ??????????" autoComplete="off"  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label"> ?????????? ????????????</label>
                                        <input type="text" name="g_service_reciept" value={this.state.Garantee_2_data[0].g_service_reciept}  onChange={(e)=>this.G2_HandleChange(e) } className="qst_Input" placeholder="???????? ?????????? ????????????" autoComplete="off"  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label"> ????????????????</label>
                                        <input type="text" name="g_phone_number" value={this.state.Garantee_2_data[0].g_phone_number} onChange={(e)=>this.G2_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????? ????????????" autoComplete="off" maxLength={11}  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label"> ??????????????</label>
                                        <input type="text" name="g_job" value={this.state.Garantee_2_data[0].g_job}  onChange={(e)=>this.G2_HandleChange(e) } className="qst_Input" placeholder="???????? ??????????????" autoComplete="off"  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label"> ???????????? ??????????</label>
                                        <input type="text" name="g_salary" value={this.state.Garantee_2_data[0].g_salary}  onChange={(e)=>this.G2_HandleChange(e) } className="qst_Input" placeholder="???????? ???????????? ??????????" autoComplete="off"  required/>
                                    </div>
                                    <div className="Input_Section_qst">
                                        <label className="qst_label"> ?????????? ??????????</label>
                                        <input type="text" name="g_work_address" value={this.state.Garantee_2_data[0].g_work_address} onChange={(e)=>this.G2_HandleChange(e) }  className="qst_Input" placeholder="???????? ?????????? ??????????" autoComplete="off"  required/>
                                    </div>
                            </div>
                        </div>
                        </>
                        }
                        {/*--------------------------?????????????? ??????????--------------------------*/}
                        <div className="Sections__Rows_Qst">
                            <h3 className="add_qst_section_headers">???????????? ??????????</h3>
                           
                            <div className="Section_splite_row_qst">
                                <div className="Input_Section_qst">
                                    <label className="qst_label">?????? ????????????</label>
                                    <Autocomplete     sx={{ display: 'inline-block', width:'100%' ,'& input': {
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
                                                        <TextField  fullWidth type="text" {...params.inputProps} className="add_qst_table_input"   required/>
                                                    </div>
                                                    )}
                                    />
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label">?????? ???????????? </label>
                                    <input type="number" name="product_price" value={this.state.product_price} onChange={(e)=>this.handlePayment(e)} className="qst_Input" placeholder="???????? ?????? ???????????? " autoComplete="off" required />
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label">???????????? <input type="checkbox" name="prepaid_auto" checked={this.state.prepaid_auto} onChange={(e)=>this.handlePrePaid(e)}/></label>
                                    <input style={{background:`${this.state.prepaid_auto? 'white' : 'rgb(201 201 201 / 32%)'}` }} type="number" disabled={!this.state.prepaid_auto} name="prepaid" value={this.state.prepaid} onChange={(e)=>this.handlePayment(e)} className="qst_Input"  autoComplete="off"  required/>
                                </div>
                                <div className="Input_Section_qst">
                                    <label className="qst_label">??????????</label>
                                    <input style={{background:'rgb(201 201 201 / 32%)'}}   type="number" name="premium" value={this.state.premium} onChange={(e)=>this.handlePayment(e)} className="qst_Input" id ="specific_colored" disabled required/>
                                </div>
                                <div className="Input_Section_qst Select_Section_qst">
                                    <label className="qst_label">??????????</label>
                                    <select name="period" value={this.state.period} onChange={(e)=>this.handlePayment(e)} className="qst_Input" >
                                        <option value="3">3</option>
                                        <option value="6">6</option>
                                        <option value="9">9</option>
                                        <option value="12">12</option>
                                        <option value="18">18</option>
                                        <option value="24">24</option>
                                    </select>
                                </div>
                                <div className="head_form_info_li">
                                    <div>
                                        <h5 className="add_qst_period_label">?????????? ??????????</h5>
                                        <LocalizationProvider locale={localeMap[this.state.locale]} dateAdapter={AdapterDateFns}>
                                            <MobileDatePicker inputFormat="yyyy/MM/d" id="date_picker"  value={this.state.Qst_date}  onChange={(newValue) => {this.setState({Qst_date:newValue.toLocaleDateString('fr-CA')}) }} /*onClick={filterData}*/
                                            renderInput={(params) =>
                                            <div ref={params.InputProps.ref} className="add_inquiry_DatePickerIcon">
                                                <label {...params.InputLabelProps} > 
                                                    <input value={this.state.Qst_date} {...params.inputProps}  className="qst_Input" />
                                                </label>
                                            </div>
                                            }/>
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className="Input_Section_qst" id="Total_qst_price">
                                    <label className="qst_label">????????????????</label>
                                    <input disabled type="number" value={this.state.total_price} id="Total_qst_price_input" required/>
                                </div>
                            </div>
                        </div>
                        {/*-------------------------- ?????? --------------------------*/}
                        <div className="add_qst_bottom_btns_div">
                        {!this.state.CodeExist ? <button type="submit" className="add_qst_bottom_btn">??????</button>
                        :
                        <button disabled  className="add_qst_bottom_btn" style={{background:'lightgrey'}}>??????</button>
                        }
                            
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
                    <div className={this.state.success_msg ? "Success_Dialog_hidden Success_Dialog_show" : "Success_Dialog_hidden"}>???? ?????????????? ?????????? !</div>
            </div>
        )
    }
}
