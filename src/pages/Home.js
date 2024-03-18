import ResponsiveAppBar from "../components/Nabvar"
import { TableFlats } from "../components/Tables"
import checkUserLogged from "../services/actions"

export default function Home(){
    checkUserLogged()
    return (
        <>
        <ResponsiveAppBar/><br/><br/><br/>
        <TableFlats/>
        </>
    )
}