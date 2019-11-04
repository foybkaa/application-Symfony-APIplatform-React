import React, {useState, useEffect} from 'react';
import Field from './../components/forms/Field';
import { Link } from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';


const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""

    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Recupération du customer en fonction de l'identifiant
    const fetchCustomer = async id => {
        try{
            const { firstName, lastName, email, company } = await CustomersAPI.find(id);
            setCustomer({ firstName, lastName, email, company});
            setLoading(false);
        }catch (error){
            toast.error("Le client n'a pas pu être chargé");
            history.replace("/customers");   
        }
    };
    // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if(id !== "new"){
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    
    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) =>{
        const { name, value} =currentTarget;
        setCustomer({...customer, [name]: value});

    };
 
    // Gestion du submit du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try{
            if(editing){
                setErrors({});
                await CustomersAPI.update(id, customer);
                toast.success("La modification a bien été prise en compte")
            }else{
                await CustomersAPI.create(customer);
                toast.success("Le client a bien été créé !")
                history.replace("/customers");
        }
            
          } catch({response}){ 
              const {violations} = response.data;

            if(violations){
                const apiErrors = {};
                violations.map(({propertyPath, message}) =>{
                apiErrors[propertyPath] = message;
                 });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire !")
              }
          }
    };

    return ( 
        <>
    {loading && <TableLoader />}
       {!loading && ( <div className="container">
        <section className="col-md-7 bg-light shadow rounded container my-5 sectionForm">
        {!editing && <h2 className="py-4 px-5 text-center titreForm">Création d'un client</h2> || <h2 className="py-4 px-5 text-center titreForm">Modification du client</h2> }
         <form onSubmit={handleSubmit}>
             <Field label="Nom de famille" 
                    name="lastName" 
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
               />
                <Field label="Prénom" 
                    name="firstName" 
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
               />
                <Field label="Email" 
                    name="email" 
                    placeholder="Adresse email du client" 
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
               />
                <Field label="Entreprise" 
                    name="company" 
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}  
               />
            
             <div 
             className="form-group text-center"><button type="submit" className="btn btn-success">Enregistrer</button>
             
             </div><Link to="/customers"className="btn btn-link">Retour à la liste</Link>
         </form>
         </section>
        </div>
       )}

    </> );
}
 
export default CustomerPage;