import React, {createContext, useState , useEffect, useMemo } from 'react'
import axios from 'axios'
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
var CryptoJS = require("crypto-js");
const cookies = new Cookies();

export const data = createContext();
axios.defaults.withCredentials = true
export default function Context(props) {
    const[navHidden , setNavHidden] = useState(false);
    const[loginStatus , setLoginstatus] = useState();
    const[auth , setAuth] = useState(false);
    const[username , setUsername] = useState('');
    const[branchname , setBranchName] = useState('');
    const[userid , setUserid] = useState(`${localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')).id : ''}`);
    const getData = async() => {
        if(localStorage.getItem('token')){
           const check = jwt_decode(localStorage.getItem('token')).id
           setUserid(check)
            await axios.get(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/login/${check}`,
            {headers:{ "x-access-token":localStorage.getItem('token')} })
            .then((response)=>{
                console.log(response.data);
             if(response.data.auth == true){
                setUserid(userid) 
                setLoginstatus(true);
                setUsername(response.data.user[0].username);
                setBranchName(response.data.user[0].branch);
                setAuth(true)
            }
            if(response.data.auth == false){
                setLoginstatus(false);
                setAuth(false)
                localStorage.removeItem('token');
            }
        })
        .catch((err)=>{
            return false
        })
    }
    else{
        setLoginstatus(false);
        setAuth(false)
    }

}

useEffect(() => {
   window.addEventListener('popstate', function (event) {
       if( window.location.pathname == '/add-cash' || window.location.pathname == 'add-qst'){
	        setNavHidden(true)
       }
       else{
           setNavHidden(false)
       }
});
},[window.location.href])

const calculationWithMemo = useMemo(() => {
  return getData();
}, []);
    return (
        <div>
            <data.Provider value={{
            navHidden,
            setNavHidden,
            loginStatus,setLoginstatus ,
            auth,setAuth ,
            username,setUsername ,
            branchname,
            userid,setUserid ,
            }}>
                {props.children}
            </data.Provider>
        </div>
    )
}










































/*
export default class Context extends Component {
constructor(props){
    super(props);
    this.state={
        loginStatus:false,
        username:'',
        userid:'',
        userType:'',
        cart_count:'',
        cart_data:[],
        cart_totalPrice:0,
        age:23
    }
}

componentWillMount(){
    axios.defaults.withCredentials = true
    axios.get("https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io//api/login")
   .then((response)=>{
       if(response.data.loginStatus == true){
           this.setState({
               loginStatus:true,
               username:response.data.user[0].username,
               userid:response.data.user[0].userid,
               userType:response.data.user[0].type,

           })
       }
       if(response.data.loginStatus == false){
         localStorage.setItem('loginStatus', false);
         this.setState({
            loginStatus:false,
         })
       }
      console.log(response);
   })
   if(!(JSON.parse(localStorage.getItem('cart_count')))){
     localStorage.setItem('cart_count', 0);
   }
   if(!(JSON.parse(localStorage.getItem('cart_items')))){
     localStorage.setItem('cart_items', '[]');
   }
   this.setState({
    cart_count: localStorage.getItem('cart_count'),
    cart_data: JSON.parse(localStorage.getItem('cart_items')),
    cart_totalPrice: JSON.parse(localStorage.getItem('total_price'))
   })
}



    render() {
        const {setcart_count,setcart_data} = this;

        return (
            <div>
                <data.Provider value={{...this.state ,setcart_count,setcart_data}}>
                    {this.props.children}
                </data.Provider>
            </div>
        )
    }
}

*/