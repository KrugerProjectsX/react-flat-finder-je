import Header from "../components/Header"
import { TableFlats } from "../components/Tables"
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const MyFlats = () =>{
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkUserLogged = async () => {
          const userLogged = await getUserLogged();
          if (!userLogged) {
            window.location.href = "/";
          }
        };
        checkUserLogged();
      }, []);

      const buttonClick = () => {
        navigate('/add-new-flat');
      };
      
    return(
    <>
    <Header/>

    <TableFlats type={'my-flats'}/>
    <br></br>
    <br></br>
   <div className="flex content-center justify-center">
   <Button onClick={buttonClick} variant="contained" >Add new flat </Button>
   </div>
    
    </>)
}



export {MyFlats}