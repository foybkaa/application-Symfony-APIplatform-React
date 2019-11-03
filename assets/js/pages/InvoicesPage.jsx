import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import { Link } from "react-router-dom";


const STATUS_CLASSES = {

    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}
const STATUS_LABELS = {

    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}


const InvoicesPage = props => {


const [invoices, setInvoices] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [search, setSearch] = useState("");
const itemsPerPage = 10;

// Récupération des invoices auprès de l'API
const fetchInvoices = async () => {
    try {
        const data = await InvoicesAPI.findAll();
           setInvoices(data);
        }catch(error) {
            console.log(error.response);
        }
    };

// Charger les invoices au chargement du composant
useEffect(() => {
    fetchInvoices();
}, []);

// Gestion du changement de page
const handlePageChange = page => setCurrentPage(page);
    
//Gestion de la recherche
const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
}

// Gestion de la suppression 
const handleDelete = async id => {
    const originalInvoices = [...invoices];

    setInvoices(invoices.filter(invoice => invoice.id !== id));

    try{
        await InvoicesAPI.delete(id);
    } catch (error) {
        console.log(error.response);
        setInvoices(originalInvoices);
        }
    };
    

// Gestion du format de date
const formatDate = (str) =>moment(str).format('DD/MM/YYYY');

// Filtrage des invoices en fonction de la recherche
const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS [i.status].toLowerCase().includes(search.toLowerCase())
    );

// Pagination des données
const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        itemsPerPage
    );

   

    return ( 
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des factures</h1>
        <Link to="/invoices/new" className="btn btn-primary ">Créer une facture</Link>
    </div>

        <div className="form-group">
            <input 
            type="text" 
            className="form-control"
            placeholder="Rechercher"
            onChange={handleSearch}
            value={search}
            />
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>N° de facture</th>
                    <th>Client</th>
                    <th className="text-center">date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedInvoices.map(invoice =>
                <tr key={invoice.id}>
                    <td>{invoice.chrono}</td>
                    <td>
                        <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                    </td>
                    <td className="text-center">{formatDate(invoice.sentAt)}</td>
                    <td className="text-center">
                        <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                    </td>
                    <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                    <td>
                    <Link 
                        to={"/invoices/" + invoice.id}
                        className="btn btn-sm btn-primary mr-1">
                             Modifier
                    </Link>
                    <button
                        onClick={() => handleDelete(invoice.id)}
                         className="btn btn-sm btn-danger">
                             Supprimer
                    </button>
                    </td>
                </tr>)}
            </tbody>
        </table>

        <Pagination 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        length={filteredInvoices.length} 
        onPageChanged={handlePageChange} 
        />
        </>
     );
}
 
export default InvoicesPage ;