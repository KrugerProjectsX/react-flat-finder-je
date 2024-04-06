import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuTransitions from "./MenuTransition";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { getUser, getUserLogged } from "../services/users";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { Link } from "react-router-dom";

export default function Header() {
  const userId = JSON.parse(localStorage.getItem("user_logged")) || false;
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

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
    <div>
       <AppBar position="sticky" >
                <Toolbar className={'bg-white p-4 flex justify-between'}>
                    <div className={' items-center '}>
                    <Link to={"/dashboard"}><ApartmentIcon sx={{ fontSize: 40, color: 'text.primary' }} /></Link>
                    
                    </div>
                    <div className=''>
                    <MenuTransitions user={user} setUser={setUser} sx={{ ml: 2 }}/>
                    </div>
                    
                </Toolbar>
            </AppBar>
    </div>
  );
}
