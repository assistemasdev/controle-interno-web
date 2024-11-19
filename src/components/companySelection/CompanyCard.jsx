import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../hooks/useCompany';
import { FaBuilding, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CompanyCard = ({ title, subtitle, options }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const contentRef = useRef(null);

  const handleOptionClick = (option) => {
    selectCompany(option);
    navigate('/dashboard');
  };

  return (
    <div
      className="card shadow-sm mb-4"
      style={{
        cursor: 'pointer',
        borderRadius: '10px',
        margin: '20px',
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
      }}
    >
      <div
        className="card-header bg-primary text-white d-flex justify-content-between align-items-center px-3 py-2"
        style={{ borderRadius: '10px 10px 0 0' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="d-flex align-items-center">
          <FaBuilding className="me-2 fs-5" />
          <div>
            <h5 className="mb-0 fs-6">{title}</h5>
            <small className="text-light">{subtitle}</small>
          </div>
        </div>
        {isExpanded ? (
          <FaChevronUp className="fs-5" />
        ) : (
          <FaChevronDown className="fs-5" />
        )}
      </div>
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? `${contentRef.current.scrollHeight}px` : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
        }}
      >
        <div className="card-body bg-light py-3">
          <div className="d-flex flex-column gap-2">
            {options.map((option, index) => (
              <button
                key={index}
                className="btn btn-sm text-white fw-semibold d-flex align-items-center justify-content-start"
                style={{
                  backgroundColor: option.color,
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease-in-out',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = option.hoverColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = option.color)
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(option);
                }}
              >
                <FaBuilding className="me-2" />
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
