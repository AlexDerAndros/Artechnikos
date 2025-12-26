import { useState, useEffect, useContext, useRef } from "react";
import { ref, uploadBytes, getDownloadURL, } from "firebase/storage";
import { addDoc, collection, onSnapshot, serverTimestamp} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {storage, db, auth} from '../config/firebase';
import {UserContext} from '../Contexts/UserContext';
import {Button, LoadingPage} from '../App';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const {admin, setLoggedIN, setUser} = useContext(UserContext);
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
            start: "top 80%",
          }
        }
      );
    });
  }, containerRef);

  return () => ctx.revert();
}, [images]);


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
    <img
      key={image.id}
      src={image.url}
      className="w-100 h-200"
      alt={image.name}
      ref={el => listRefs.current[index] = el}
    />
  ))}
</div>

      </div> 
     )}
    </>
  );
}
