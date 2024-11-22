import React, { useState, useEffect } from "react";
import Button from "../login/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { useApplication } from "../../hooks/useApplication";
import { useNavigate } from "react-router-dom";
import ApplicationService from "../../services/ApplicationService"; // Serviço para buscar aplicações
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const ApplicationCard = () => {
  const { selectApplication } = useApplication();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]); 
  const [selectedApplication, setSelectedApplication] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await ApplicationService.getAll();
        if (data.length > 0) {
          setApplications(data);
          setSelectedApplication(data[0]); 
        } else {
          setError("Nenhuma aplicação disponível.");
        }
        setLoading(false);
      } catch (err) {
        setError("Erro ao buscar aplicações.");
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleSlideChange = (swiper) => {
    setSelectedApplication(applications[swiper.activeIndex]);
  };

  const handleAdvance = () => {
    if (selectedApplication) {
      selectApplication(selectedApplication);
      navigate("/orgaos");
    }
  };

  if (loading) return <p>Carregando aplicações...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 mx-auto">
      <div className="card o-hidden border-0 shadow-lg">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="h4 font-color-blue-light">Selecione uma aplicação!</h1>
          </div>

          {applications.length > 0 ? (
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
              {applications.map((application) => (
                <SwiperSlide key={application.id}>
                  <div
                    className="d-flex align-items-end justify-content-center rounded shadow"
                    style={{
                      backgroundImage: `url(${application.image || "https://via.placeholder.com/300x300"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "200px",
                      width: "200px",
                      margin: "0 auto",
                    }}
                  >
                    <p className="text-white fw-bold text-shadow p-2 m-0">{application.name}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-3">Nenhuma aplicação disponível.</p>
            </div>
          )}

          <Button
            text="Avançar"
            className="btn btn-blue-light w-100 d-flex align-items-center justify-content-center"
            onClick={handleAdvance}
            disabled={!selectedApplication || loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
