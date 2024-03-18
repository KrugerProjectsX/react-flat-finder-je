export default function checkUserLogged(){
    const userId = JSON.parse(localStorage.getItem('user_logged')|| false);
    if(!userId){
        window.location.href= '/';
    }
}