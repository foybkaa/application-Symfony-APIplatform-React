import React, {useState, useContext} from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';

const LoginPage = ({history}) => {

    const { setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
     } )

    const [error, setError] = useState("");

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value });
    }

    // Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try{
          await AuthAPI.authenticate(credentials);
          setError("");
          setIsAuthenticated(true);
          history.replace("/customers");
        } catch(error){
            setError("Informations incorrect");
        }
    }
    
    return (
        <>
    <div className="container">
        <section className="col-md-7 bg-light shadow rounded container my-5 sectionForm">
        <h2 className="py-4 px-5 text-center titreForm">Connexion</h2>

         <form onSubmit={handleSubmit}>
             <div className="form-group pl-3 pt-3">
                 <label htmlFor="username">Adress email</label>
                    <input value={credentials.username} onChange={handleChange} type="email" placeholder="Adresse email de connexion" className={"form-control" + (error && " is-invalid")} name="username" id="username"/>
                   {error && <p className="invalid-feedback">{error}</p>}
            </div>
             <div className="form-group pl-3">
                 <label htmlFor="password">Mot de passe</label>
                    <input value={credentials.password} onChange={handleChange} type="password" placeholder="Mot de passe" className="form-control" name="password" id="password"/>
            </div>

             <div className="form-group text-center"><button type="submit" className="btn btn-success">Je me connecte</button></div>
         </form>
         </section>
        </div>
        </>
         );
}
 
export default LoginPage;