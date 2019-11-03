import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import { Link } from "react-router-dom";

const CustomersPage = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Permet d'aller récupérer les customer
    const fetchCustomers = async () => {
        try{
            const data = await CustomersAPI.findAll()
            setCustomers(data)
        }catch(error){
            console.log(error.response)
        }
    }

    // Au chargement du composant, on va chercher les customers
    useEffect(() =>{ fetchCustomers();
    }, []);

    // Gestion de la suppression d'un customer
    const handleDelete = async id => {
        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id))
        

        try {
            await CustomersAPI.delete(id)
            console.log("delete ok")
        } catch(error){
            setCustomers(originalCustomers);
        }
    };


    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);
    
    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
      setSearch(currentTarget.value);
      setCurrentPage(1);
    }

    const itemsPerPage = 10;

    // Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
           (c.company && c.company.toLowerCase().includes(search.toLowerCase())) 
    )


    // Pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage, 
        itemsPerPage
    );

    return ( <>


    <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des Clients</h1>
        <Link to="/customers/new" className="btn btn-primary ">Créer un client</Link>
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
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entrprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedCustomers.map(customer => (
                <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                        <a href="#">{customer.firstName} {customer.lastName}</a>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">{customer.invoices.length}</td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <button
                         onClick={() => handleDelete(customer.id)}
                         disabled={customer.invoices.length > 0} 
                         className="btn btn-sm btn-danger">
                             Supprimer</button>
                    </td>
                </tr>))}
            </tbody>
        </table>

       {itemsPerPage < filteredCustomers.length && ( <Pagination 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        length={filteredCustomers.length} 
        onPageChanged={handlePageChange} 
        />
       )}
    </> 
  );
}
 
export default CustomersPage;