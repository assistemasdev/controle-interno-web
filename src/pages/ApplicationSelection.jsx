
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/sb-admin-2.min.css';
import '../assets/styles/custom-styles.css'; 
import Button from "../components/login/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { useApplication } from "../hooks/useApplication";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ApplicationCard from '../components/application/ApplicationCard';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import useUserService from "../hooks/services/useUserService";
import useLoader from "../hooks/useLoader";
import useNotification from "../hooks/useNotification";

const ApplicationSelection = () => {
    const { selectApplication } = useApplication();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const { getUserApplications} = useUserService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                showLoader();
                const response = await getUserApplications(user.id);
                setApplications(response.data);
                setSelectedApplication(response.data[0]);
            } catch (error) {
                showNotification("error", "Erro ao carregar as aplicações.");
                console.error("Erro ao buscar aplicações:", error);
            } finally {
                hideLoader();
            }
        };

        fetchApplications();
    }, [user]);

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

                        {
                            applications.length > 0 ? (
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
                                text="Avançar"
                                className="btn btn-blue-light w-100"
                                onClick={handleAdvance}
                                disabled={!selectedApplication}
                                />
                            </div>
                            <div className="col-12 col-md-6 d-flex justify-content-center">
                                <Button
                                text="Voltar"
                                className="btn btn-blue-light w-100"
                                onClick={handleBack}
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


