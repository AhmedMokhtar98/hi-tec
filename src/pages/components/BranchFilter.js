import React,{useState, useEffect} from 'react'
import axios from 'axios'
export default function BranchFilter({SetBranch,bransh}) {
 
const [branches, setBranches] =useState([])

useEffect(() => {
    axios.post('https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/branches-2')
    .then((response)=>{
        setBranches(response.data.branches)
    })
}, [])

    return(
         <div>
           {/*----------------------P R I C E Sorting---------------------*/}
            <div className="filter_type_div">
                <div className="filter_type_header">المعرض</div>
                <select id="add_cash_select_branch" className="add_cash_input" value={bransh} onChange={SetBranch} className="filter_option">
                    {branches.map((item,key)=>
                        <option value={`${item.branch_name}`}>{item.branch_name}</option>
                    )}
                </select>
            </div>
         </div>
        )
}

