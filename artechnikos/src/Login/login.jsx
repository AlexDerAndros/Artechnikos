import { useState, useEffect, useContext } from "react";
import { doc, setDoc,} from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { UserContext } from "../Contexts/UserContext";
import { Button, LoadingPage } from "../App";

export function Login() {
  const[registerUser, setRegisterUser] = useState('');
  const[registerPassword, setRegisterPassword] = useState('');
  const[password, setPassword] = useState('');
  const[userI, setUserI] = useState('');
  const[login, setLogin] = useState(false);
  const[loading, setLoading] = useState(true);
  const {user, setUser, loggedIN, setLoggedIN} = useContext(UserContext);
  const[clickR, setClickR] = useState(false);


  const pressL = () => {
    const newLogin = !login;
    setLogin(newLogin);
    setUser('');
    setPassword('');
    setRegisterPassword('');
    setRegisterUser('');
  };
  
 
       
   
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.emailVerified) {
        setLoggedIN(true);
        setUser(user.email);
      } else {
        localStorage.setItem(
          'valueR',
          "Bitte bestätige zuerst deine E-Mail-Adresse, bevor du dich anmelden kannst."
        );
        setLoggedIN(false);
        setUser('');
      }
    } else {
      setLoggedIN(false);
      setUser('');
    }
    setLoading(false); 
  });

  return () => unsubscribe();
}, [setLoggedIN, setUser]);

const log = async() => {
  if (userI.trim() && password.trim()) {
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, userI, password);
      setLoggedIN(true);
      localStorage.setItem('loggedIN', true);
      setUser(userCred.user.email);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }
};

const register = async () => {
  if (registerUser.trim() && registerPassword.trim()) {
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, registerUser, registerPassword);
      await sendEmailVerification(userCred.user);
      localStorage.setItem('valueR', "Bestätigungslink wurde erfolgreich gesendet!");
      await setDoc(doc(db, 'users', userCred.user.uid), {
        user: userCred.user.email,
        isAdmin: false,
      });
      setClickR(true);
      localStorage.setItem("clickR", true);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }
};

const logOut = async () => {
  setLoading(true);
  try {
    await signOut(auth);
    setLoggedIN(false);
    setUser('');
  } catch (e) {
    alert(e.message);
  } finally {
    setLoading(false);
  }
};


  if (loading === true) {
    return <LoadingPage text={clickR == true ? localStorage.getItem('valueR') : " Lade Benutzerstatus"}/> 
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
