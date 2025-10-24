/* Imports */
import { useState, useEffect, createContext, useContext} from "react";
import { addDoc, collection, doc, getDocs, onSnapshot, setDoc, where, query} from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, storage, } from "./firebase.js";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const UserContext = createContext();

/** Code */
const Button = ({text, customStyle, press}) => {
  return (
    <button onClick={press}
           className={`${customStyle} bg-red-500 font-bold flex justify-center items-center`}>
      {text}
    </button>
  );
}
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

function Formular() {
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
    return <div>Lade Daten...</div>;
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

function Login() {
  const[registerUser, setRegisterUser] = useState('');
  const[registerPassword, setRegisterPassword] = useState('');
  const[password, setPassword] = useState('');
  const[userI, setUserI] = useState('');
  const[login, setLogin] = useState(false);
  const[loading, setLoading] = useState(true);
  const {user, setUser, loggedIN, setLoggedIN} = useContext(UserContext);


  const pressL = () => {
    const newLogin = !login;
    setLogin(newLogin);
    setUser('');
    setPassword('');
    setRegisterPassword('');
    setRegisterUser('');
  };
  
  const log = async() => {
    if(userI.trim() != '' && password.trim() != '') {
      await signInWithEmailAndPassword(auth, userI, password)
      .then((userCred) => {
         const newLoggedIN = true;
         setLoggedIN(newLoggedIN);
         localStorage.setItem('loggedIN', newLoggedIN);
         setUser(userCred.user.email);
      })
      .catch((e) => {
        alert(e);
      });
       
    } 
  };
  const register = async() => {
     if(registerUser.trim() != '' && registerPassword.trim() != '') {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, registerUser, registerPassword)
        const newLoggedIN = true;
        setLoggedIN(newLoggedIN);
        setUser(userCred.user.email);
        await setDoc(doc(db, 'users', userCred.user.uid), {
         user: userCred.user.email,
         isAdmin: false
       });

      }catch(e) {
        alert(e);
      }
     }
  };
  const logOut = async() => {
    await signOut(auth)
    .then(() => {
       const newLoggedIN = false;
       setLoggedIN(newLoggedIN);
    })
    .catch((e) => {
      alert(e);
    });
      
       
  }

  
      
    
  useEffect(() => {
   
    const authChanged = onAuthStateChanged(auth, (user) =>{
      if(user) {
        setLoggedIN(true);
        setUser(user.email); 
      }
      else {
        setLoggedIN(false);
        setUser('');
      }
      setLoading(false);
    });
    return () => authChanged();
  }, [setLoggedIN, setUser]);

  if (loading === true) {
    return <div>Lade Benutzerstatus...</div>; 
  } 
  return (
    <>
     {loggedIN == true ? (
      <div>
        Hi {user}!
        <Button text={'Log out'} press={() => logOut()} customStyle={'w-32 h-32'}/>
      </div>
     ): (
     <> 
     <div className="w-full flex flex-row justify-center gap-10 cursor-pointer" onClick={pressL}>
       <div className={login == false ? `text-black` : `text-gray-500`}>
         Login 
       </div>
       <div className={login == true ? `text-black` : `text-gray-500`}>
        Register
       </div>
       </div>
       {login == true ? (
         <div className="w-full flex flex-col justify-center items-center">
             Enter an email: 
            <input type="text" value={registerUser} onChange={(e) => setRegisterUser(e.target.value)} className="bg-black text-white"/>
            Create a password: 
            <input type="text" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="bg-black text-white"/>
             <Button text={"Register"} customStyle={'w-32 h-20 text-lg'} press={() => register()}/>
      </div>
       ): (
         <div className="w-full flex flex-col justify-center items-center">
            Email: 
            <input type="text" value={userI} onChange={(e) => setUserI(e.target.value)} className="bg-black text-white"/>
            Password: 
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black text-white"/>
             <Button text={"Login"} customStyle={'w-32 h-20 text-lg'} press={() => log()}/>
         </div>
       )}
     </>
    )}
    </>
  );
}

function Gallery() {
  const {admin, setLoggedIN, setUser} = useContext(UserContext);
  const[file, setFile] = useState(null);
  const[url, setUrl] = useState('');
  
  const uploadImage = async() => {
    if(file) {
      const imageRef = ref(storage, `images/${file.name}`);
      try {
        await uploadBytes(imageRef, file);
        const downloadedUrl = await getDownloadURL(imageRef);
        setUrl(downloadedUrl);
      }catch(e) {
        alert(e);
      }
    }
  }
   useEffect(() => {
   
    const authChanged = onAuthStateChanged(auth, (user) =>{
      if(user) {
        setLoggedIN(true);
        setUser(user.email); 
      }
      else {
        setLoggedIN(false);
        setUser('');
      }
    });
    return () => authChanged();
  }, [setLoggedIN, setUser]);
  return (
    <>
    {admin == true && ( <> 
       <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
       <Button customStyle={"w-32 h-20 text-lg"} text={'Upload'} press={uploadImage}/>
       {url && (
        < img src={url} className="w-32 h-32"/>
       )} 
       </>)}
     
    </>
  );
}
