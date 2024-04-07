import Header from "../components/Header"

import { TableFlats } from "../components/Tables"
import { getUserLogged } from "../services/users";
import { useEffect } from "react";



const MyFlats = () =>{
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
    <TableFlats type={'my-flats'}/>
    </>)
}



export {MyFlats}