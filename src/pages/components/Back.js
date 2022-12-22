import React from 'react'
import {BiArrowBack} from 'react-icons/bi'
import { useHistory } from 'react-router-dom';
 const  GoBack = ()=> {
    const history = useHistory();
    const Back = ()=>{
        history.goBack()
    }
    return ( <><BiArrowBack onClick={()=>Back()} className="header_back_arrow"/></>)
}

export default GoBack;

