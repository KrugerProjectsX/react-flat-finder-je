import  FlatForm  from "../components/FlatForm"
import Header from "../components/Header"
import { getUserLogged } from "../services/users";
import { useEffect } from "react";


const NewFlat = () =>{
    useEffect(() => {
        const checkUserLogged = async () => {
          const userLogged = await getUserLogged();
          if (!userLogged) {
            window.location.href = "/";
          }
        };
        checkUserLogged();
      }, []);
    

    return(
    <>
        <Header/>
        <FlatForm type={'create'} id={null} user={null}/>
    </>)
}

export {NewFlat}