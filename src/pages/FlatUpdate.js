import { useParams, useSearchParams } from "react-router-dom";

export default function Flat(){
    let {id} = useParams()
    if(id===undefined) {
        id=null;
    }
}