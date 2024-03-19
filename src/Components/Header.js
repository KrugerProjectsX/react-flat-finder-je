import React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuTransitions from "./MenuTransition";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../src/Firebase";
import {getUser, getUserLogged} from "../services/users";
import Link from 

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
        <div>
            <AppBar position="static">
                <Toolbar className={'bg-white'}>
                    <div className={'flex items-center m-4'}>
                        <img className="pointer-events-none my-auto w-24 lg:w-40 md:w-32"  alt="My SVG"/>

                    </div>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    </Typography>
                    <div className={'flex items-center justify-center mr-2'}>
                        <Button className={'text-secondary'}>Home</Button>
                        <Button className={'text-secondary'}>My Flats</Button>
                        <Button className={'text-secondary'}>Favourites</Button>
                        { user && user.role ==='admin' && <Link><Button className={'text-secondary'}>Users</Button></Link>}
                    </div>
                    <MenuTransitions user={user} setUser={setUser}/>
                </Toolbar>
            </AppBar>
        </div>
    );
}