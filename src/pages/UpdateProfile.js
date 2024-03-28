import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';    
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormRegister from '../components/FormRegister';
import ResponsiveAppBar from '../components/Header'
import { useParams } from 'react-router-dom';

const defaultTheme = createTheme();

export default function UpdateProfile() {

    let {userId} = useParams();
    if(userId===undefined) {
        userId=null;
    }
//TODO:VERIFICAR Q\S ELQ EU ACTUALIZA UN USAURIO QUE NO ES EL MISMO SEA ADMIN 
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
            Update Profile
        </Typography>
        <FormRegister type={'update'} userId={userId}/>
        </Box>
    </Container>
    </ThemeProvider>
   </>
);
}