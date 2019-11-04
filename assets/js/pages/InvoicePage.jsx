import React, {useState, useEffect} from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';


const InvoicePage = ({history, match}) => {

    const { id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });
    const [loading, setLoading] = useState(true);

    // Recupération des clients
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);

            if(!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
        } catch(error) {
            toast.error("Impossible de charger les clients");
            history.replace('/customers');
        }
    };

    // Recupération d'une facture 
    const fetchInvoice = async id => {
        try {
            const { amount, status, customer } = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
            setLoading(false);
        } catch(error) {
            toast.error("Impossible de charger la facture demandée");
            history.replace('/invoices');
        }
    };

    // Récupération de la liste des clients à chaque chargement du composant
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Recupération de la bonne facture quand l'id de l'URL change
    useEffect(() => {
        if(id !== "new"){
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) =>{
        const { name, value} =currentTarget;
        setInvoice({...invoice, [name]: value});
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            if(editing){
                setErrors({});
                await InvoicesAPI.update(id, invoice);
                toast.success("Modification réussi !")
            }else{
                await InvoicesAPI.create(invoice);
                toast.success("Création de votre facture réussi !")
            history.replace("/invoices");
            }
        } catch({response}){ 
            const {violations} = response.data;

          if(violations){
              const apiErrors = {};
              violations.map(({propertyPath, message}) =>{
              apiErrors[propertyPath] = message;
               });
              setErrors(apiErrors);
              toast.error("Des erreurs dans votre formulaire");
            }
        }
    };

    return ( 
        <>
{loading && <TableLoader />}
    {!loading && ( <div className="container">
        <section className="col-md-7 bg-light shadow rounded container my-5 sectionForm">
        {!editing && <h2 className="py-4 px-5 text-center titreForm">Création d'une facture</h2> || <h2 className="py-4 px-5 text-center titreForm">Modification d'une facture</h2> }
         <form onSubmit={handleSubmit}>
             <Field label="Montant" 
                    name="amount"
                    type="number" 
                    placeholder="Montant de la facture"
                    value={invoice.amount}
                    onChange={handleChange}
                    error={errors.amount}
                    />

               <Select  
                    name="customer" 
                    label="Client"
                    value={invoice.customer} 
                    error={errors.customer}
                    onChange={handleChange} 
                >
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}

                  
                </Select>

                <Select  
                    name="status" 
                    label="Statut" 
                    value={invoice.status} 
                    error={errors.status}
                    onChange={handleChange} 
                >

                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>

                </Select>

             <div 
             className="form-group text-center"><button type="submit" className="btn btn-success">Enregistrer</button>
             </div>
             <Link to="/invoices"className="btn btn-link">Retour aux factures</Link>
         </form>
         </section>
        </div>
    )}
    </>
     );
}
 
export default InvoicePage;