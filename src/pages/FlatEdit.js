import {useParams} from "react-router-dom";
import FlatForm from "../components/FlatForm";
import Header from "../components/Header";

export default function FlatEdit() {
    let  {id } = useParams()
    return (
        <div>
            <Header/><br/><br/>
            <h1>FlatEdit</h1>
            <FlatForm type={'update'} id = {id}/>
        </div>
    );  
}