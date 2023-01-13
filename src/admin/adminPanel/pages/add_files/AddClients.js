import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios';
import * as xlsx from 'xlsx'
import {BsFileEarmarkPlus,BsFileEarmarkText} from 'react-icons/bs'
import './add_files.css'
// import Lottie from 'react-lottie';
import uploading from './component/uploading';
import Button  from '@mui/material/Button';

export default function AddClients() {
const inputRef = useRef(null);
const[folder_name]=useState('excel')
const[FileType, setFileType]=useState(false)
const[FileName, setFileName]=useState('')
const[array, setArray]=useState([])
const[dataLength, setDataLength]=useState(0)
const[loading, setLoading]=useState(false)
const[success_msg, setSuccessMsg]=useState(false)

const handleOpenFileInput = () => { inputRef.current.click(); };
const readUploadFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0]; 
    setFileName(e.target.files[0].name)         
    if( file.type == "application/vnd.ms-excel"){ setFileType(true)
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                const x = json.map(({nat_id,code,username,nickname,address,housing_contract,service_reciept,phone_number,job,salary,work_address,date,branch}) => [nat_id,code,username,nickname,address,housing_contract,service_reciept,phone_number,job,salary,work_address,date,branch]);
                setArray(x)
                setDataLength(json.length)
                let isKeyPresent = json.some(el => {
                    if(el.hasOwnProperty('nat_id','code','username','nickname','address','housing_contract','service_reciept','phone_number','job','salary','work_address','date','branch')  ){setFileType(true)}
                    if(!el.hasOwnProperty('nat_id','code','username','nickname','address','housing_contract','service_reciept','phone_number','job','salary','work_address','date','branch') ){setFileType(false)}
                })
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }
    else{setFileType(false)}
}


const SubmitFile = (e)=>{
    e.preventDefault()
    if(array.length>0){
        if(FileType){
        setLoading(true)
            const body={data:array}
            axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/add-finite-clients-2`,body)
            .then(response =>{
                setArray('')
                setFileName('')
                setTimeout(() => {setLoading(false); setSuccessMsg(true) }, 1500);
                setTimeout(() => { setSuccessMsg(false) }, 3000);
            })
            e.target.reset()
        }
        else{ e.target.reset(); alert('الملف غير مدعوم'); setArray('')}
    }
    else{alert('أدخل ملف اولا..')}
}

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: uploading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="dashboard_center_content_container">
        <div className="Add_file_header"> اضافة عملاء بلا حدود </div>
        <form onSubmit={(e)=>SubmitFile(e)}  enctype="multipart/form-data" method="post">
            <input onChange={(e)=>readUploadFile(e)} type="file" name="main_image_multer" accept=".xls" ref={inputRef} hidden/>
            <div className="add_file_icon_div" onClick={handleOpenFileInput}> {loading && array.length>0 ? <> <BsFileEarmarkText className="Add_files_icon" id="file_exist_color"/></> :<> <div className="file_name_div">{FileName}</div> <BsFileEarmarkPlus className="Add_files_icon"/> </> }  </div>
            <button  type="submit" className="Submit_file_button" >حفظ</button>
        </form>
        {loading ? <div className="uploading_animation">
                    {/* <Lottie options={defaultOptions} height={400} width={400}/> */}
                  </div>
        : ''}
         <div id="success_uploading_MSG" className={success_msg ? "Success_Dialog_hidden Success_Dialog_show" : "Success_Dialog_hidden"}>تم اضافة {dataLength} عميل بنجاح !</div>
    
    </div>
  )
}


