
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/sb-admin-2.min.css';
import '../assets/styles/custom-styles.css'; 
import Button from "../components/login/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { useApplication } from "../hooks/useApplication";
import { useNavigate } from "react-router-dom";
import ApplicationService from "../services/ApplicationService";
import { useAuth } from "../hooks/useAuth";
import ApplicationCard from '../components/application/ApplicationCard';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const ApplicationSelection = () => {
    const { selectApplication } = useApplication();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
        try {
            const response = await ApplicationService.getAll(navigate);
            if (response) {
                setApplications(response.result.data);
                setSelectedApplication(response.result.data[0]);
            } else {
                setError("Nenhuma aplicação disponível.");
            }
        } catch (error) {
            setError("Erro ao carregar as aplicações.");
            console.error("Erro ao buscar aplicações:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchApplications();
    }, []);

    const handleSlideChange = (swiper) => {
        const selected = applications[swiper.activeIndex] || null;
        setSelectedApplication(selected);
    };

    const handleAdvance = () => {
        if (selectedApplication) {
        selectApplication(selectedApplication);
        navigate("/orgaos");
        }
    };

    const handleBack = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-pages-blue-light">
            <div className="col-xl-4 col-lg-6 col-md-8 mx-auto">
                <div className="card o-hidden border-0 shadow-lg">
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <h1 className="h4 font-color-blue-light">Selecione uma aplicação!</h1>
                        </div>

                        {loading ? (
                            <div className="text-center">Carregando aplicações...</div>
                        ) : error ? (
                            <div className="text-center py-4">
                                <p className="text-muted mb-3">{error}</p>
                            </div>
                        ) : applications.length > 0 ? (
                            <Swiper
                                modules={[EffectCoverflow, Navigation]}
                                effect="coverflow"
                                grabCursor
                                centeredSlides
                                slidesPerView={1}
                                coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                                }}
                                navigation
                                className="mb-4"
                                onSlideChange={handleSlideChange}
                            >
                                {applications
                                    .filter(option => option.active)  
                                    .map((option, index) => (
                                        <SwiperSlide key={index}>
                                        <ApplicationCard option={option} />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted mb-3">Nenhuma aplicação disponível.</p>
                            </div>
                        )}

                        <div className="row mt-3 g-2 justify-content-center">
                            <div className="col-12 col-md-6 d-flex justify-content-center">
                                <Button
                                text="Voltar"
                                className="btn btn-blue-light w-100"
                                onClick={handleBack}
                                />
                            </div>
                            <div className="col-12 col-md-6 d-flex justify-content-center">
                                <Button
                                text="Avançar"
                                className="btn btn-blue-light w-100"
                                onClick={handleAdvance}
                                disabled={!selectedApplication || loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationSelection;


