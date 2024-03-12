import { Routes, Route } from 'react-router-dom';
import './App.css';

import LogIn from './pages/LogIn';
import Home from './pages/Home'
import SignUp from './pages/SignUp'

function App() {
  return (
    <Routes>
      <Route path ={"/"} element ={<LogIn/>} />
      <Route path ={"/dashboard"} element ={<Home/>} />
      <Route path ={"/sign-up"} element ={<SignUp/>} />
    </Routes>
  
  );
}

export default App;
