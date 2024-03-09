import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import LogIn from './pages/LogIn';

function App() {
  return (
    <Routes>
      <Route path ={"/"} element ={<LogIn/>} />
      <Route path ={"/dashboard"} element ={<Home/>} />
    </Routes>
  
  );
}

export default App;
