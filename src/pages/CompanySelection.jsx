// src/pages/CompanySelection.jsx
import React from 'react';
import CompanyCard from '../components/companySelection/CompanyCard';
import Header from '../components/companySelection/Header';

const companies = [
    { 
        title: 'Almoxarifado', 
        subtitle: 'Toque para exibir os órgãos', 
        options: [] 
    },
    { 
        title: 'Aluguel - Equipamentos', 
        subtitle: 'Toque para exibir os órgãos', 
        options: [
        { name: 'ALUCOM', color: '#BF2626' },
        { name: 'IP', color: '#FFA500' },
        { name: 'MOREIA', color: '#5d8dbb' }
        ]
    },
];


const readCompanies = () => {
    return companies.map((company, index) => (
        <div key={index} className="col-md-4 mb-4">
            <CompanyCard
            title={company.title}
            subtitle={company.subtitle}
            options={company.options}
            />
        </div>
    ))
}

const CompanySelection = () => {
  return (
    <div>
      <Header />
      <div className="custom-container py-4">
        <div className="row">
            { companies.length > 0? readCompanies() : <h1>Sem aplicativos cadastrados</h1> }
        </div>
      </div>
    </div>
  );
};

export default CompanySelection;
