import React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuTransitions from "./MenuTransition";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../src/Firebase";
import {getUser, getUserLogged} from "../services/users";
import { Link } from 'react-router-dom';
import ApartmentIcon from '@mui/icons-material/Apartment';


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
                    <ApartmentIcon className='text-black'/>
                    </div>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    </Typography>
                    <div className={'flex items-center justify-center mr-2'}>
                    <Link to="/dashboard"><Button className={'text-secondary'}>Home</Button></Link>
                        { user && (user.role === 'landlord' || user.role === 'admin' )  && <Link to="/dashboard"><Button className={'text-secondary'}>My Flats</Button></Link>}
                        <Button className={'text-secondary'}>Favorites</Button>
                        { user && user.role ==='admin' && <Link to="/users">
                                <Button className={'text-secondary'}>Users</Button>
                            </Link>}
                    </div>
                    <MenuTransitions user={user} setUser={setUser}/>
                </Toolbar>
            </AppBar>
        </div>
    );
}