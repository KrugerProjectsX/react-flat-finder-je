import { TableFlats } from "../components/Tables"
import Header from "../components/Header"
import { getUserLogged } from "../services/users";
import { useEffect } from "react";

    
const FavoriteFlats = () =>{
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
    <TableFlats type = {'favorite-flats'}/>
    
    </>
    )
}

export {FavoriteFlats} ; 