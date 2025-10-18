/* Imports */
import { useState, useEffect } from "react";
import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.js";
import { Routes, Route, Link } from "react-router-dom";

/** Code */
export default function App() {
  return (
    <>
      <div>
        <Link to="/">
          <div>Startseite</div>
        </Link>
        <Link to="/Formular">
          <div className="w-full text-xl font-bold flex items-center justify-center">
            Formular
          </div>
        </Link>
        <Link to="/Login">
          <div className="w-full text-xl font-bold flex items-center justify-center">
            Login
          </div>
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/Formular" element={<Formular />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </>
  );
}

function Startseite() {
  return <div>Startseite</div>;
}

function Formular() {
  const [valueVN, setValueVN] = useState("");
  const [valueNN, setValueNN] = useState("");
  const [valueA, setValueA] = useState("");
  const [clickAl, setClickAl] = useState(false);
  const [array, setArray] = useState([]);
  const [arrayG, setArrayG] = useState([]);

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

    // ✅ onSnapshot jetzt hier mit Cleanup
    const unsubscribe = onSnapshot(collection(db, "FormTest"), (snapshot) => {
      const datas = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setArray(datas);
    });

    return () => unsubscribe(); // Cleanup, wenn Komponente unmounted
  }, []);

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

function Login() {
  return <div>Login</div>;
}
