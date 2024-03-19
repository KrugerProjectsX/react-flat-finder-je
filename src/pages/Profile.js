import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';    
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormRegister from '../components/FormRegister';
import Button from '@mui/material/Button';
import { navigate, useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../components/Header'

const defaultTheme = createTheme();

export default function Profile() {
    const navigate =useNavigate();

    const handleUpdateProfile = () => {
        navigate('/update-profile'); // Utiliza navigate para redirigir a la página de actualización de perfil
    };


return (
   <>
   <ResponsiveAppBar/>
    <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
        sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
        >   
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Profile
        </Typography>
        <FormRegister type={'view'}/>
        <br></br>
        <Button onClick={handleUpdateProfile} variant="contained">Update Profile</Button>
        </Box>
        
    </Container>
    </ThemeProvider>
   </>
);
}