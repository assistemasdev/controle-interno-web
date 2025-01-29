
import React, { useEffect, useState} from 'react';
import Button from '../components/login/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useOrgan } from '../hooks/useOrgan';
import { useAuth } from '../hooks/useAuth';
import { useApplication } from '../hooks/useApplication';
import { usePermissions } from '../hooks/usePermissions';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/sb-admin-2.min.css';
import '../assets/styles/custom-styles.css'; 
import OrganCard from '../components/organ/OrganCard';
import useBaseService from '../hooks/services/useBaseService';
import useLoader from '../hooks/useLoader';
import { entities } from '../constants/entities';

const CompanySelection = () => {
    const { selectOrgan } = useOrgan();
    const [message, setMessage] = useState('Nenhum órgão disponível para esta aplicação.');
    const { user } = useAuth();
    const { userRoles, UserHasRole } = usePermissions();
    const { selectedApplication, removeApplication } = useApplication();
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const { get: getUserApplicationOrganizations } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const fetchOrgans = async () => {

        if (user && selectedApplication) {
            try {
                showLoader();
                const response = await getUserApplicationOrganizations(entities.users.applicationsAndOrganizations(user.id).get(selectedApplication.id));
                const formattedOrgans = response.result.data
                    .filter(organ => organ.active)  
                    .map((organ) => ({
                        ...organ,
                        color: organ.color || "#cccccc", 
                        name: organ.name || "Sem nome",   
                    })
                );

                const hasAdminRole = UserHasRole(['Super Admin', 'Admin'], userRoles);
                
                if (hasAdminRole) {
                    const adminOrgan = {
                        id: "admin",
                        name: "Admin",
                        color: "#dc143c", 
                    };
                    
                    const organsWithAdmin = [...formattedOrgans, adminOrgan];
                    setOptions(organsWithAdmin);
                    setSelectedOption(organsWithAdmin.length > 0 ? organsWithAdmin[0] : null);
                } else {
                    setOptions(formattedOrgans);
                    setSelectedOption(formattedOrgans.length > 0 ? formattedOrgans[0] : null);
                }
                return;
            } catch (error) {
                console.error("Erro ao buscar órgãos:", error);
                setOptions([]);
            } finally {
                hideLoader();
            }
        }
        };

        fetchOrgans();
    }, [user, selectedApplication, userRoles]);

    const handleSlideChange = (swiper) => {
        const selected = options[swiper.activeIndex] || null;
        setSelectedOption(selected);
    };

    const handleAdvance = () => {
        if (selectedOption) {
        selectOrgan(selectedOption);
        navigate("/dashboard");
        }
    };

    const handleBack = () => {
        removeApplication();
    };
    
    return (
        <div className="d-flex bg-pages-blue-light align-items-center justify-content-center vh-100">
            <div className="col-xl-4 col-lg-6 col-md-8 mx-auto">
                <div className="card o-hidden border-0 shadow-lg">
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <h1 className="h4 font-color-blue-light">Selecione um órgão!</h1>
                        </div>

                        {options.length > 0 ? (
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
                                {options.map((option, index) => (
                                <SwiperSlide key={index}>
                                    <OrganCard organ={option}/>
                                </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted mb-3"> { message }</p>
                            </div>
                        )}

                        <div className="row mt-3 g-2 justify-content-center">
                            <div className="col-12 col-md-6 d-flex justify-content-center">
                                <Button
                                text="Avançar"
                                className="btn btn-blue-light w-100"
                                onClick={handleAdvance}
                                disabled={!selectedOption}
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
    


export default CompanySelection;



