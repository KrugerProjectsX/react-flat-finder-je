import { Routes, Route } from 'react-router-dom';
import './App.css';

import LogIn from './pages/LogIn';
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import { NewFlat } from './pages/NewFlat';
import Profile from './pages/Profile';


function App() {
  
  return (
    <Routes>
      <Route path ={"/"} element ={<LogIn/>} />
      <Route path ={"/dashboard"} element ={<Home/>} />
      <Route path ={"/sign-up"} element ={<SignUp/>} />
      <Route path ={"/add-new-flat"} element ={<NewFlat/>} />
      <Route path ={"/profile"} element ={<Profile/>} />

    </Routes>
  
  );
}

export default App;
