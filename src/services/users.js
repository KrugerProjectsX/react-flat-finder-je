import {doc, getDoc} from "firebase/firestore"
import {db} from '../../src/Firebase'

export async function getUserLogged (){
    const userId= getUserId();
    if(userId){
        const ref= doc(db,"users",userId);
        const dataUser = await getDoc(ref);
        return {...dstaUser.data()};
    }
}


export  function getUser(){
    return JSON.parse(localStorage.getItem("user_logged"))||false;
}