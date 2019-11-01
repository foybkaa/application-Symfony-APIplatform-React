import axios from "axios";
import jwtDecode from "jwt-decode";

// Permet de se déconnecter (suppression du token du localStorage et sur Axios)
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}
// Positionne le token JWT sur axios
function setAxiosToken(token){
    axios.defaults.headers["authorization"] = "Bearer " + token;
}
// Permet de se connecter(stockage du token sur localStorage et sur Axios)
function authenticate(credentials){
   return  axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
        // Je stocke le token dans mon localStorage
        window.localStorage.setItem("authToken", token);
        // On prévient Axios qu'on à maintenant un header par default sur toute nos futures requequetes HTTP
        setAxiosToken(token);
        })
}

// Mise en place lors du chargement de l'application
function setup(){
    // 1. Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if(token){
          const {exp: expiration} = jwtDecode(token)
          if(expiration * 1000 > new Date().getTime()){
            setAxiosToken(token);
          }
        }
    }
// Permet de savoir si on est authentifié ou pas
function isAuthenticated(){
    // 1. Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
    if(token){
        const {exp: expiration} = jwtDecode(token)
        if(expiration * 1000 > new Date().getTime()){
          return true;
        }
        return false
     }
     return false
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}