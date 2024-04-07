import FlatForm from "../components/FlatForm";
import {useParams} from "react-router-dom";
import Header from "../components/Header";
import { getUserLogged } from "../services/users";
import { useEffect } from "react";

export default function FlatEdit() {
    let  {id } = useParams()
    useEffect(() => {
        const checkUserLogged = async () => {
          const userLogged = await getUserLogged();
          if (!userLogged) {
            window.location.href = "/";
          }
        };
        checkUserLogged();
      }, []);
    return (
        <div>
            
            <Header/>
            <h1>Flat-Update</h1>
            <FlatForm type={'update'} id = {id}/>
        </div>
    );
}