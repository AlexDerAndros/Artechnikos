/* Imports */
import { useState, useEffect} from "react";
import { collection, getDocs, where, query} from "firebase/firestore";
import { db} from "./config/firebase.js";
import { Routes, Route, Link, useLocation, Form } from "react-router-dom";
import {UserContext} from './Contexts/UserContext.js';
import {Gallery} from './Gallery/gallery';
import { Login } from "./Login/login.jsx";
import { Formular } from "./Formular/formular.jsx";

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
      <div className="w-full text-xl font-bold flex items-center justify-around">
        <Link to="/">
          <div className={location.pathname === '/' ? 'text-red-500': 'text-black'}>Startseite</div>
        </Link>
        <Link to="/Formular">
          <div className={location.pathname === '/Formular' ? `text-red-500`: 'text-black'} >
            Formular
          </div>
        </Link>
        <Link to="/Login">
          <div className={location.pathname === '/Login' ? `text-red-500`: 'text-black'}>
            Login 
          </div>
        </Link>
        <Link to="/Gallery">
          <div className={location.pathname === '/Gallery' ? `text-red-500`: 'text-black'}>
            Gallery
          </div>
        </Link>
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
  return <div>Startseite</div>;
}

