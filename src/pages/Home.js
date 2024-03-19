import Header from "../components/Header";
import { TableFlats } from "../components/Tables";
import checkUserLogged from "../services/actions";


export default function Home(){
    checkUserLogged()
    return (
        <>
        <Header/>
        <TableFlats/>
        </>
    )   
}