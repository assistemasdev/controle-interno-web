import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../hooks/useCompany'; 
import '../../assets/styles/companySelection/CompanyCard.css';

const CompanyCard = ({ title, subtitle, options }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { selectCompany, selectedCompany } = useCompany(); 

  const handleOptionClick = (option) => {
    selectCompany(option);
    console.log(selectedCompany)
    navigate('/dashboard');
  };

  return (
    <div className={`company-card shadow-sm ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
      <div className="company-card-header">
        <h5 className="company-card-title">{title}</h5>
        <p className="company-card-subtitle">{subtitle}</p>
      </div>
      <div className={`company-card-body ${isExpanded ? 'show' : ''}`}>
        {options.map((option, index) => (
          <button key={index} className="btn option-btn" onClick={() => handleOptionClick(option)}>
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompanyCard;
