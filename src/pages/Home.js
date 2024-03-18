import ResponsiveAppBar from "../components/Nabvar"
import { TableFlats } from "../components/Tables"

export default function Home(){
    return (
        <>
        <ResponsiveAppBar/><br/><br/><br/>
        <TableFlats type={'all-flats'}/>
        </>
    )
}