import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios';
import * as xlsx from 'xlsx'
import {BsFileEarmarkPlus,BsFileEarmarkText} from 'react-icons/bs'
import './add_files.css'
// import Lottie from 'react-lottie';
import uploading from './component/uploading';
import Button  from '@mui/material/Button';

export default function AddGarantees() {
 
const inputRef = useRef(null);
const[folder_name]=useState('excel')
const[FileType, setFileType]=useState(false)
const[FileName, setFileName]=useState('')
const[array, setArray]=useState([])
const[ClientsIds, setClientsIds]=useState([])
const[DropedGarantees, setDropedGarantees]=useState([])
const[Alert_status, setAlert]=useState(false)
const[dataLength, setDataLength]=useState(0)
const[loading, setLoading]=useState(false)
const[success_msg, setSuccessMsg]=useState(false)

const handleOpenFileInput = () => { inputRef.current.click(); };

const getClients_ID = ()=>{
    axios.get(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/get-clients-ids`)
    .then(response =>{
        setClientsIds(response.data.result)
    })

}
useEffect(() => { getClients_ID() }, [])


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

                var filter = json.filter(x => ClientsIds.find(y=>y.client_id == x.client_id));
                const filtered = filter.map(({g_name,g_relationship,g_nickname,g_nat_id,g_address,g_housing_contract,g_service_reciept,g_phone_number,g_job,g_salary,g_work_address,client_id,branch}) => [g_name,g_relationship,g_nickname,g_nat_id,g_address,g_housing_contract,g_service_reciept,g_phone_number,g_job,g_salary,g_work_address,client_id,branch]);
                setArray(filtered)
                setDataLength(json.length)
                //--------Droped Garanteees-------/
                const droped_garantees = json.filter(v => !ClientsIds.some(b => parseInt(v.client_id) ===  parseInt(b.client_id) ));
                setDropedGarantees(droped_garantees)
                if(droped_garantees.length > 0){setTimeout(() => {
                    setAlert(true)
                }, 100);}
                //------- Is File Valid -------/
                let isKeyPresent = json.some(el => {
                    if(el.hasOwnProperty('g_name','g_relationship','g_nickname','g_nat_id','g_address','g_housing_contract','g_service_reciept','g_phone_number','g_job','g_salary','g_work_address','client_id ','branch')  ){setFileType(true)}
                    if(!el.hasOwnProperty('g_name','g_relationship','g_nickname','g_nat_id','g_address','g_housing_contract','g_service_reciept','g_phone_number','g_job','g_salary','g_work_address','client_id ','branch')){setFileType(false)}
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
            axios.post(`https://app-31958949-9c59-4302-94ca-f9eaf62903af.cleverapps.io/api/add-finite-garantees`,body)
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
        <div className="Add_file_header"> اضافة ضامنين بلا حدود </div>
        {!Alert_status && 
        <form onSubmit={(e)=>SubmitFile(e)}  enctype="multipart/form-data" method="post">
            <input onChange={(e)=>readUploadFile(e)} type="file" name="main_image_multer" accept=".xls" ref={inputRef} hidden/>
            <div className="add_file_icon_div" onClick={handleOpenFileInput}> {loading && array.length>0 ? <> <BsFileEarmarkText className="Add_files_icon" id="file_exist_color"/></> :<> <div className="file_name_div">{FileName}</div> <BsFileEarmarkPlus className="Add_files_icon"/>  </> }  </div>
            
            <button  type="submit" className="Submit_file_button" >حفظ</button>
        </form>
        }
        {loading ? <div className="uploading_animation">
                    {/* <Lottie options={defaultOptions} height={400} width={400}/> */}
                  </div>
        : ''}
         <div id="success_uploading_MSG" className={success_msg ? "Success_Dialog_hidden Success_Dialog_show" : "Success_Dialog_hidden"}>تم اضافة {dataLength} عميل بنجاح !</div>
      {Alert_status && 
        <>
        {DropedGarantees.length>0 &&
        <div className="Alert_MSG_Container">
                <div className="Alert_Header">رقم قومي العملاء التاليين غير موجود في قاعدة البيانات <br></br>و لم يتم أدخال الضامنين التاليين</div>
                <div className="Alert_MSG">
                    {DropedGarantees.map((item,index)=>
                        <div className="Alert_ul">
                            <div  className="Alert_li"><div>  اسم الضامن :</div><div>{item.g_name}</div></div>
                            <div  className="Alert_li"><div>  رقم قومي الضامن :</div><div>{item.g_nat_id}</div></div>
                            <div  className="Alert_li"><div>  رقم قومي العميل :</div><div>{item.client_id}</div></div>
                        </div>
                    )} 
                </div>
                <button className="Alert_msg_button" onClick={()=>setAlert(false)}>متابعة</button>
        </div>
        }
        </>
       }
    </div>
  )
}


