import React, {useState} from 'react';
import Field from '../components/forms/Field';
import { Link } from "react-router-dom";
import UsersAPI from '../services/usersAPI';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) =>{
        const { name, value} =currentTarget;
        setUser({...user, [name]: value});
    };
    
    // Gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Mot de passe non identique"
            setErrors(apiErrors);
            return;
        }

        try{
            await UsersAPI.register(user);
            setErrors({});
            history.replace('/login');
        }catch({response}){ 
            const {violations} = response.data;

          if(violations){
              violations.map(({propertyPath, message}) =>{
              apiErrors[propertyPath] = message;
               });
              setErrors(apiErrors);
            }
        }
    };

    return ( 
        <>
     <div className="container">
        <section className="col-md-7 bg-light shadow rounded container my-5 sectionForm">
        <h2 className="py-4 px-5 text-center titreForm">Inscription</h2>

        <form onSubmit={handleSubmit}>

        <Field 
            name="firstName"
            label="Prénom"
            placeholder="Votre prénom"
            error={errors.firstName}
            value={user.firstName}
            onChange={handleChange}
        />
        <Field 
            name="lastName"
            label="Nom de famille"
            placeholder="Votre nom"
            error={errors.lastName}
            value={user.lastName}
            onChange={handleChange}
        />
        <Field 
            name="email"
            label="Email"
            placeholder="Votre adresse email"
            type="email"
            error={errors.email}
            value={user.email}
            onChange={handleChange}
        />
        <Field 
            name="password"
            label="Mot de passe"
            placeholder="Votre mot de passe"
            type="password"
            error={errors.password}
            value={user.password}
            onChange={handleChange}
        />
       <Field 
            name="passwordConfirm"
            label="Confirmation de mot de passe"
            placeholder="Confirmez votre mot de passe"
            type="password"
            error={errors.passwordConfirm}
            value={user.passwordConfirm}
            onChange={handleChange}
        />

        <div className="form-group text-center"><button type="submit" className="btn btn-success">confirmation</button></div>
        <Link to="/login"className="btn btn-link">J'ai déjà un compte</Link>
         </form>
         </section>
        </div>
        </>
         );
}
 
export default RegisterPage;