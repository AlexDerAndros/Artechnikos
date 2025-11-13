import { useState, useEffect, useContext } from "react";
import { ref, uploadBytes, getDownloadURL, } from "firebase/storage";
import { addDoc, collection, onSnapshot, serverTimestamp} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {storage, db, auth} from '../config/firebase';
import {UserContext} from '../Contexts/UserContext';
import {Button, LoadingPage} from '../App';


export function Gallery() {
  const {admin, setLoggedIN, setUser} = useContext(UserContext);
  const[file, setFile] = useState(null);
  const[url, setUrl] = useState('');
  const[name, setName] = useState('');
  const[images, setImages] = useState([]);
  const[loading, setLoading] = useState(true);
  
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

 
  return (
    <>
    {admin == true && ( <> 
       <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
       <Button customStyle={"w-32 h-20 text-lg"} text={'Upload'} press={uploadImage}/>
       {url && (
        < img src={url} className="w-32 h-32"/>
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
        {images.map((image) => (
          <>
           <img src={image.url} key={image.id} className="w-32 h-32" alt={image.name}/>
           {image.createdAt?.toDate ? image.createdAt.toDate().toLocaleDateString() : "unbekannt"}
          </> 
        ))}
      </div> 
     )}
    </>
  );
}
