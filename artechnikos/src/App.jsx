/*Imports */
import { addDoc, collection } from "firebase/firestore";
import {db} from "./firebase.js";

export default function App() {
  const press = async() => {
     try {
      await addDoc(collection(db, "Test"), {
        test: "Hallo"
      });
     } catch(e) {
      alert(e);
     }
  }
  return (
   <> 
     <div className="text-red-500" onClick={press}>
       Hi
     </div>
    </>
  );
}