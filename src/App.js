import { Routes, Route } from 'react-router-dom';
import './App.css';
import LogIn from './pages/LogIn';
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import { NewFlat } from './pages/NewFlat';
import UpdateProfile from './pages/UpdateProfile'
import Profile from './pages/Profile';
import Users from './pages/Users';
import { MyFlats } from './pages/MyFlats';
import { FavoriteFlats } from './pages/FavoriteFlats';
import Flat  from "./pages/Flat";
import FlatEdit from './pages/FlatEdit';



function App() {
  
  return (
    <Routes>
      <Route path ={"/"} element ={<LogIn/>} />
      <Route path ={"/dashboard"} element ={<Home/>} />
      <Route path ={"/sign-up"} element ={<SignUp/>} />
      <Route path ={"/add-new-flat"} element ={<NewFlat/>} />
      <Route path ={"/profile"} element ={<Profile/>} />
      <Route path ={"/profile/:userId"} element ={<Profile/>} />    
      <Route path ={"/update-profile"} element ={<UpdateProfile/>} />
      <Route path ={"/update-profile/:userId"} element ={<UpdateProfile/>} />
      <Route path ={"/users"} element ={<Users/>} />
      <Route path ={'/my-flats'} element ={<MyFlats/>}/>
      <Route path = {'/favorite-flats'} element = {<FavoriteFlats/>}/>
      <Route path={"/flat/:id"} element={<Flat/>} />
      <Route path={"/flat/edit/:id"} element={<FlatEdit/>} />
      
    </Routes> 
  
  );
}

export default App;
