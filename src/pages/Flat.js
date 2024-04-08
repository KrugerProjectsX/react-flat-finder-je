import {useParams} from "react-router-dom";
import Header from "../components/Header";
import FlatForm from "../components/FlatForm";
import Messages from "../components/Messages";
import { getUserLogged } from "../services/users";
import { useEffect } from "react";


export default function Flat() {
    let { id }  = useParams();
    console.log(id)
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
            <h1>View Flat</h1>
            <FlatForm type={'view'} id={id} />
            <Messages  flatId={id}/>
            
        </div>
    );
}