import React, { useEffect, useState } from "react";
import Button from "../login/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useOrgan } from "../../hooks/useOrgan";
import { useAuth } from "../../hooks/useAuth";
import { useApplication } from "../../hooks/useApplication";
import UserOrganizationService from "../../services/UserOrganizationService";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const OrganCard = () => {
  const { selectOrgan } = useOrgan();
  const { user } = useAuth();
  const { selectedApplication, removeApplication } = useApplication();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgans = async () => {
      if (user && selectedApplication) {
        try {
          setLoading(true);
          const organs = await UserOrganizationService.getOrganizationsByUserAndApplication(
            user.id,
            selectedApplication.id
          );

          const formattedOrgans = organs.map((organ) => ({
            ...organ,
            color: organ.color || "#cccccc",
            hoverColor: organ.hoverColor || "#bbbbbb",
            name: organ.name || "Sem nome",
          }));

          setOptions(formattedOrgans);
          setSelectedOption(formattedOrgans.length > 0 ? formattedOrgans[0] : null);
        } catch (error) {
          console.error("Erro ao buscar órgãos:", error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrgans();
  }, [user, selectedApplication]);

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
    <div className="col-xl-4 col-lg-6 col-md-8 mx-auto">
      <div className="card o-hidden border-0 shadow-lg">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="h4 font-color-blue-light">Selecione um órgão!</h1>
          </div>

          {loading ? (
            <div className="text-center">Carregando órgãos...</div>
          ) : options.length > 0 ? (
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
                  <div
                    className="d-flex align-items-end justify-content-center rounded shadow"
                    style={{
                      backgroundColor: option.color,
                      height: "200px",
                      width: "200px",
                      margin: "0 auto",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = option.hoverColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = option.color)
                    }
                  >
                    <p className="text-white fw-bold text-shadow p-2 m-0">
                      {option.name}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-3">Nenhum órgão disponível para esta aplicação.</p>
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
      disabled={!selectedOption || loading}
    />
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default OrganCard;
