import { useState, useEffect, useContext, useRef } from "react";
import { ref, uploadBytes, getDownloadURL, } from "firebase/storage";
import { addDoc, collection, onSnapshot, serverTimestamp} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {storage, db, auth} from '../config/firebase';
import {UserContext} from '../Contexts/UserContext';
import {Button, LoadingPage} from '../App';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const {admin, setLoggedIN, setUser, loggedIN} = useContext(UserContext);
  const[file, setFile] = useState(null);
  const[url, setUrl] = useState('');
  const[name, setName] = useState('');
  const[images, setImages] = useState([]);
  const[loading, setLoading] = useState(true);
  const listRefs = useRef([]);
  const containerRef = useRef(null);
  
   const uploadImage = async() => {
    if(file) {
      const imageRef = ref(storage, `images/${file.name}`);
      try {
        await uploadBytes(imageRef, file);
        const downloadedUrl = await getDownloadURL(imageRef);
        setUrl(downloadedUrl);
        setName(file.name);
        await addDoc(collection(db, 'images'), {
          url: downloadedUrl,
          name: file.name,
          createdAt: serverTimestamp()
        });
      }catch(e) {
        alert(e);
      }
    }
  };
   
 
    
   
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
    const getImages = onSnapshot(collection(db, 'images'), (snapshot) => {
      const datas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(datas);
      setLoading(false);
    });
    
    return () => {
       authChanged();
       getImages();
    };
     

  }, [setLoggedIN, setUser]);

 useEffect(() => {
  if (!listRefs.current.length) return;

  const ctx = gsap.context(() => {
    listRefs.current.forEach(el => {
      if (!el) return;

      gsap.fromTo(
        el,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top 20%",
          }
        }
      );
    });
  }, containerRef);

  return () => ctx.revert();
}, [images]);

  
 
  if(loggedIN == true) {
  return (
    <>
    {admin == true && ( <> 
       <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
       <Button customStyle={"w-32 h-20 text-lg"} text={'Upload'} press={uploadImage}/>
       {url && (
        < img src={url} className="w-100 h-100"/>
       )} 
       {name && (
        <span>Dateienname:{name}</span>
       )}
       </>)}
      {loading === true ? (
        <LoadingPage text={images.length === 1 ? "Bild" : "Bilder"}/>
      ): (
       <div>
       
        {images.length > 0 ? (<span>Gespeichertes Bild:</span>): images.length > 2 ?(<span>Gespeicherte Bilder</span>): (<span></span>)}
       <div ref={containerRef}>
 {images.map((image, index) => (
  <span key={image.id}>
    <img
      src={image.url}
      className="w-100 h-200"
      ref={el => (listRefs.current[index] = el)}
    />
   <p>
      {image.createdAt?.toDate().toLocaleDateString("de-DE")}
   </p>
  </span>
))}
</div>

      </div> 
     )}
    </>
  );
} else if(loading === false && loggedIN == false) {
    return (
      <div className="font-inter flex flex-col justify-center items-center w-full pt-30 text-xl"> 
        Bitte einloggen um die Gallery zu sehen unter diesem Link: 
        <Link to="/Login" className="underline text-blue-500 font-bold">
        Logge dich jetzt ein!
        </Link>
      </div>
    );
}
}
