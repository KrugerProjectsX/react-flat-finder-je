import FlatForm from "../components/FlatForm";
import {useParams} from "react-router-dom";

export default function FlatEdit() {
    let  {id } = useParams()
    return (
        <div>
            <h1>FlatEdit</h1>
            <FlatForm type={'update'} id = {id}/>
        </div>
    );
}