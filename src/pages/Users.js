import Header from "../components/Header";
import UsersTable from "../components/UsersTable";
import { getUserLogged } from "../services/users";
import { useEffect } from "react";


export default function Users() {
    useEffect(() => {
        const checkUserLogged = async () => {
          const userLogged = await getUserLogged();
          if (!userLogged) {
            window.location.href = "/";
          }
        };
        checkUserLogged();
      }, []);
    return (
        <div>
            <Header/>
            <h1>Users</h1>
            <UsersTable/>
        </div>
    );
}