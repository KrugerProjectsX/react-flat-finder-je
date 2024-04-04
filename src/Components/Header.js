import React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuTransitions from "./MenuTransition";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../Firebase";
import {getUser, getUserLogged} from "../services/users";
import ApartmentIcon from '@mui/icons-material/Apartment';
import { Box } from '@mui/material';


export default function Header() {
    const userId = JSON.parse(localStorage.getItem('user_logged')) || false;
    const [user, setUser] = useState(null);
    const [userLoaded, setUserLoaded] = useState(false);

    const processData = async () => {
        await getUserData();
    }

    const getUserData = async () => {
        const responseUser = await getUserLogged();
        console.log(responseUser);
        setUser(responseUser);
    }
    useEffect(() => {
        processData();
    }, [])
    
    return (
        <Box sx={{width: '100%'}}>
            <AppBar position="static">
                <Toolbar className={'bg-white flex justify-between'}>
                    <div className={' items-center '}>
                    <ApartmentIcon className='text-black'/>
                    </div>
                    <div className=''>
                    <MenuTransitions user={user} setUser={setUser}/>
                    </div>
                    
                </Toolbar>
            </AppBar>
        </Box>
    );
}