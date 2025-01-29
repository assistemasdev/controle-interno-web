import React from "react";
import MainLayout from "../layouts/MainLayout";
import '../assets/styles/NotFound.css'
const NotFound  = () => {
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="error-page">
                <div className="content-error">
                    <h1 data-text="404">404</h1>
                    <h4 data-text="Opps! Página não encontrada">Opps! Página não encontrada</h4>
                    <p>
                        Parece que você se perdeu ou a página que está procurando não existe.  
                        Se você acredita que isso é um erro ou precisa de ajuda, entre em contato conosco.  
                    </p>
                    <div className="btns-error">
                        <a href="/dashboard">Retornar para dashboard</a>
                        <a 
                            href="https://wa.me/5585989724339?text=Olá!%20Tenho%20uma%20dúvida." 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Reportar problema
                        </a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default NotFound;
