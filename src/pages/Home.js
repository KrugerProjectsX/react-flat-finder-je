import Header from "../components/Header";
import { TableFlats } from "../components/Tables";
import checkUserLogged from "../services/actions";
import { getUserLogged } from "../services/users";
import { useState } from "react";
import { useEffect } from "react";



export default function Home(){
    checkUserLogged()
    const [user , setUser] = useState()
    const processData = async () => {
        await getUserData();
      };
    
      const getUserData = async () => {
        const responseUser = await getUserLogged();
        setUser(responseUser);
      };
      useEffect(() => {
        processData();
      }, []);
    return (
        <>
        <Header/>
        <TableFlats user={user} setUser={setUser} type={'all-flats'}/>
        </>
    )   
}