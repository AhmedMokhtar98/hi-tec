import React, { useState } from 'react'
import { Redirect, Route } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const PrivateRoute = ({children,...rest})=>{
const check = localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')).id : 0
const authority = localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')).authority : ''
    return (
      <Route {...rest} render={()=> check > 0 && ( authority ==='admin' || authority === 'branch') ?  children : <Redirect to="/login"/> }/>
    )
}

export default PrivateRoute;











/*import React, { useEffect, useContext, useMemo} from 'react'
import axios from 'axios'
import { Route } from 'react-router';
import { useState } from 'react/cjs/react.development';
import { data } from './../../Context/Context';
import jwt_decode from "jwt-decode";
import { Redirect, useHistory } from 'react-router-dom';


const PrivateRoute = ({children,...rest})=>{
const getStatus = async()=> {
  if(localStorage.getItem('token')){
    var token = localStorage.getItem('token');
  try {
    const res = await axios.get('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/isUserAuth',
    {headers:{ "x-access-token":localStorage.getItem('token')} })
    .then((response)=>{
        if (response.data.auth ) {
        setStatus(true)
        setAuth(true)
        } 
        else {
        localStorage.removeItem('token');
        setStatus(false)
        setAuth(false)
        }
    })
  } catch (err) {
    localStorage.removeItem('token');
        setStatus(false)
        setAuth(false)
  }
  }
  else{
     setStatus(false)
    history.push('/login')
     setAuth(false)
  }
}
const [status, setStatus] = useState(null);
const {setAuth} = useContext(data)
const history = useHistory()
const calculationWithMemo = useMemo(() => {
  return getStatus();
}, []);

return (
     status && (
      <Route
        {...rest}
        render={() => (status ? children : <Redirect to="/login" /> )}
      />
     )
  );
}

export default PrivateRoute;

*/
