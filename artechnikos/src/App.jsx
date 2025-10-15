/*Imports */
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import {db} from "./firebase.js";

export default function App() {
  
  return (
   <> 
     <Formular/> 
   </>
  );
}

function Formular() {
  const[valueVN, setValueVN] = useState('');
  const[valueNN, setValueNN] = useState('');
  const[valueA, setValueA] = useState('');
  const[clickAl, setClickAl] = useState(false);
   
  const addFormular = async() => {
     try {
       if(valueA.trim() != '' && valueNN.trim() != '' && valueVN.trim() != '') {
         await addDoc(collection(db, "FormTest"), {
          name: valueVN + ',' + valueNN,
          age: valueA
         });
         setValueVN('');
         setValueNN('');
         setValueA('');
         const newClickAl = true;
         setClickAl(newClickAl);
         localStorage.setItem('clickAlready', newClickAl);
       }
      
     } catch(e) {
      alert(e);
     }
  };

  const checkClickAlready = () => {
    if(localStorage.getItem('clickAlready') == "true") {
      setClickAl(true);
    } else {
      setClickAl(false);
    }
  };

  useEffect(() => {
     checkClickAlready();
  }, []);
  return (
   <div className="flex flex-col w-full justify-center items-center gap-3">
     {clickAl == true ? (
      <>
        Sie haben bereits das Formular abgeschickt!
      </>
     ): (
      <>
         <div className="font-bold">Fomular</div>
         <input type="text" placeholder="Vorname..." onChange={(e) => setValueVN(e.target.value)} className="text-white bg-black p-2"/>
         <input type="text" placeholder="Nachname..." onChange={(e) => setValueNN(e.target.value)} className="text-white bg-black p-2"/>
         <input type="text" placeholder="Alter..." onChange={(e) => setValueA(e.target.value)} className="text-white bg-black p-2"/>
         <button onClick={addFormular}>Abschicken</button>  
      </>
     )}
    
   </div>
  );
}