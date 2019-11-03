import React, {useState, useContext} from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';

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
             <Field label="Adress email" 
                    name="username" 
                    value={credentials.username} 
                    onChange={handleChange} 
                    placeholder="Adresse email de connexion" 
                    id="username" 
                    type="email"
                    error={error} />
            
            <Field label="Mot de passe" 
                    name="password" 
                    value={credentials.password}
                    type="password"
                    onChange={handleChange}
                    id="password" 
                    error="" />

             <div className="form-group text-center"><button type="submit" className="btn btn-success">Je me connecte</button></div>
         </form>
         </section>
        </div>
        </>
         );
}
 
export default LoginPage;