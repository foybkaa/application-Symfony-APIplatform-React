import React from 'react';
import logo from '../../img/techno.png';

const HomePage = (props) => {
    return ( <div className="jumbotron">
    <h1 className="display-3">Bienvenue <img src={logo} alt=""/> </h1> 
    <p className="lead">Tout d'abord merci pour l'intêret que vous portez à mon travail. <br/>
    Ce CRM de gestion de clients et de factures a été réalisé grâce à la formation de <a href="https://www.linkedin.com/in/lior-chamla/?originalSubdomain=fr">Lior Chamla</a> ; <br/>
    Pour la réalisation de ce projet, j'ai dú utiliser plusieurs technologies : <span className="techno">Symfony - ApiPlatform - React</span>  <br/> 
    Durant cette formation enrichissante , j'ai pu mettre en pratique certaines compétences indispensables au métier de développeur Web notamment : <br/>
    </p>
    <hr className="my-4"/>
  <div className="row">
    <div className="col">
  <div className="card">
  <div className="card-body">
    <p className="card-text">- Créer un application en Symfony 4 <br/>
    - Mettre en place et configurer ApiPlatform <br/>
    - Créer une application React qui exploite mon API <br/>
    - Mettre en place un système d'authentification JWT (Jason Web Token) <br/>
     </p>
  </div>
</div>
    </div>
    <div className="col">
    <div className="card">
  <div className="card-body">
    <p className="card-text">- La gestion des Users inscription / connexion / déconnexion <br/>
    - La gestion des clients et des factures création / modification / suppression<br/>
    - La mise en place d'un système de pagination et une barre de recherche <br/></p>
  </div>
</div>
    </div>
  </div>


    
  
  </div> );
}
 
export default HomePage;