import React,{useState,useEffect} from 'react'
import './home.css'
import HeaderMenu from './../components/HeaderMenu';

export default function Home() {
const[matches1,setMatches1] = useState(window.matchMedia("(min-width: 950px)").matches)
useEffect(() => {const handler1 = (e) => setMatches1( e.matches ); window.matchMedia("(min-width: 950px)").addListener(handler1);},[])
  return (
    <div className="Page_Container">
        <div className="Page_Header"> 
            {!matches1 && <HeaderMenu/>}
            <div className="Header_word">الصفحة الرئيسية</div>
        </div>
        <img src={process.env.PUBLIC_URL+'/home/5.png'} className="home_image"/>
    </div>
  )
}
