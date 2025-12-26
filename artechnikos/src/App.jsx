/* Imports */
import { useState, useEffect, useRef} from "react";
import { collection, getDocs, where, query} from "firebase/firestore";
import { db} from "./config/firebase.js";
import { Routes, Route, Link, useLocation, Form } from "react-router-dom";
import {UserContext} from './Contexts/UserContext.js';
import {Gallery} from './Gallery/gallery';
import { Login } from "./Login/login.jsx";
import { Formular } from "./Formular/formular.jsx";
import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
/** Code */
export const Button = ({text, customStyle, press}) => {
  return (
    <button onClick={press}
           className={`${customStyle} bg-red-500 font-bold flex justify-center items-center`}>
      {text}
    </button>
  );
}
export const LoadingPage = ({text})  => {
   return (
    <div>{text} ...</div>
   );
};


export default function App() {
  const[user, setUser] = useState('');
  const[admin, setAdmin] = useState(false);
  const[loggedIN, setLoggedIN] = useState(false);
  const location = useLocation();

  useEffect(() => {
      const checkAdmin = async() => {
       const q = query(collection(db, 'users'),
       where('user','==', user));
       const snapshot = await getDocs(q);
       snapshot.forEach((doc) => {
         const datas = doc.data();
         setAdmin(datas.isAdmin);
       });
    };
    checkAdmin();
  },  [user]);
  return (
   <>
      <div className="w-full text-xl font-text font-bold flex items-center justify-around mt-2 ">
        <div className="flex flex-row w-1/2 items-center">
         <img src="./Logo_ohneHintergrund.png" className="w-1/3 h-50"/>
         <div className="font-bold text-xl">ARTECHNIKOS</div>
        </div>
        <span className="text-lg font-light flex flex-row gap-10">
         <Link to="/">
           <div className={location.pathname === '/' ? 'text-red-500': 'text-mainC'}>Startseite</div>
         </Link>
         {/* <Link to="/Formular">
           <div className={location.pathname === '/Formular' ? `text-red-500`: 'text-black'} >
             Formular
           </div>
         </Link> */}
         <Link to="/Login">
           <div className={location.pathname === '/Login' ? `text-red-500`: 'text-mainC'}>
             Login 
           </div>
         </Link>
         <Link to="/Gallery">
           <div className={location.pathname === '/Gallery' ? `text-red-500`: 'text-mainC'}>
             Gallery
           </div>
         </Link>
        </span>  
       </div>
      <UserContext.Provider value={{user, setUser, admin, loggedIN, setLoggedIN}}>
        <Routes>
           <Route path="/" element={<Startseite />} />
           <Route path="/Formular" element={<Formular />} />
           <Route path="/Login" element={<Login />} />
           <Route path="/Gallery" element={<Gallery />} />
        </Routes>
      </UserContext.Provider>  
    </>
  );
}

function Startseite() {
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(box1.current,
       {opacity: 0, x:-300}, {opacity:1, x:0, duration: 1, ease: "power3.inOut", 
        scrollTrigger: {trigger: box1.current, start: "top 90%", end: "top 20%", toggleActions: "play none none reverse"}});
      gsap.fromTo(box2.current,
       {opacity: 0, x:-300}, {opacity:1, x:0, duration: 1, ease: "power3.inOut", 
        scrollTrigger: {trigger: box2.current, start: "top 90%", end: "top 20%", toggleActions: "play none none reverse"}});
      gsap.fromTo(box3.current,
       {opacity: 0, x:-300}, {opacity:1, x:0, duration: 1, ease: "power3.inOut", 
        scrollTrigger: {trigger: box3.current, start: "top 90%", end: "top 20%", toggleActions: "play none none reverse"}});

      });
  return () => {
    ctx.revert();
  };
   
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-y-10 mt-10 overflow-y-hidden">
      <div className="w-1/2 h-200 bg-red-500" ref={box1}></div>
      <div className="w-1/2 h-200 bg-yellow-500" ref={box2}></div>
      <div className="w-1/2 h-200 bg-orange-500" ref={box3}></div>
    </div>
  );
}

