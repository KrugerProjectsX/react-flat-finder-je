import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import { NewFlat } from './pages/NewFlat';

function App() {
  return (
    <Routes>
      <Route path ={"/"} element ={<Home/>} />
      <Route path ={"/add-new-flat"} element ={<NewFlat/>} />
    </Routes>
  
  );
}

export default App;
