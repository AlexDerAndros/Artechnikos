import { useState, useEffect } from "react";
import { addDoc, collection, getDocs, onSnapshot} from "firebase/firestore";
import { db } from "../config/firebase";
import { LoadingPage } from "../App";


export function Formular() {
  const [valueVN, setValueVN] = useState("");
  const [valueNN, setValueNN] = useState("");
  const [valueA, setValueA] = useState("");
  const [clickAl, setClickAl] = useState(false);
  const [array, setArray] = useState([]);
  const [arrayG, setArrayG] = useState([]);
  const [loading, setLoading] = useState(true);

  const addFormular = async () => {
    try {
      if (valueA.trim() !== "" && valueNN.trim() !== "" && valueVN.trim() !== "") {
        await addDoc(collection(db, "FormTest"), {
          name: valueVN + "," + valueNN,
          age: valueA,
        });

        const newClickAl = true;
        setClickAl(newClickAl);
        localStorage.setItem("clickAlready", newClickAl);
      }
    } catch (e) {
      alert(e);
    }
  };

  const checkDataGetD = async () => {
    const snapshot = await getDocs(collection(db, "FormTest"));
    const datas = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setArrayG(datas);
    setLoading(false);
  };

  const checkClickAlready = () => {
    if (localStorage.getItem("clickAlready") === "true") {
      setClickAl(true);
    } else {
      setClickAl(false);
    }
  };
  
  useEffect(() => {
    checkClickAlready();
    checkDataGetD();
    const checkDataOnSnap = onSnapshot(collection(db, 'FormTest'), (snapshot) => {
      const datas = snapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      setArray(datas);
      setLoading(false);
    });
    return () => checkDataOnSnap();
  },[]);
  
  if(loading === true) {
    return <LoadingPage text={"Lade Daten"}/>
  }
  return (
    <div className="flex flex-col w-full justify-center items-center gap-3">
      {clickAl === true ? (
        <>Sie haben bereits das Formular abgeschickt!</>
      ) : (
        <>
          <div className="font-bold">Formular</div>
          <input
            type="text"
            placeholder="Vorname..."
            onChange={(e) => setValueVN(e.target.value)}
            className="text-white bg-black p-2"
            value={valueVN}
          />
          {valueVN}
          <input
            type="text"
            placeholder="Nachname..."
            onChange={(e) => setValueNN(e.target.value)}
            className="text-white bg-black p-2"
            value={valueNN}
          />
          {valueNN}
          <input
            type="text"
            placeholder="Alter..."
            onChange={(e) => setValueA(e.target.value)}
            className="text-white bg-black p-2"
            value={valueA}
          />
          {valueA}
          <button onClick={addFormular} className="bg-red-500">
            Abschicken
          </button>
        </>
      )}

      <div className="w-full flex flex-col items-center gap-5">
        Formular Test onSnapshot:
        {array.map((item, index) => (
          <span key={index}>
            Name: {item.name}, Age: {item.age}
          </span>
        ))}
        Formular Test getDocs:
        {arrayG.map((item, index) => (
          <span key={index}>
            Name: {item.name}, Age: {item.age}
          </span>
        ))}
      </div>
    </div>
  );
}
