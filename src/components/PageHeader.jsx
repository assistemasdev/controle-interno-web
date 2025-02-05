import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button'; 

const PageHeader = ({ title, showBackButton = false, backUrl = '/' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(backUrl);
    };

    return (
        <div className="container-fluid p-1">
            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 d-flex justify-content-between align-items-center">
                <span>{title}</span> 
                {showBackButton && (
                    <Button
                        text="Voltar"
                        className="btn btn-blue-light fw-semibold"
                        onClick={handleBack}
                    />
                )}
            </div>
        </div>
    );
};

export default PageHeader;
