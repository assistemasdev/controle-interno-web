import React, { useState } from "react";
import Button from "../login/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { useApplication } from "../../hooks/useApplication";
import { useNavigate } from 'react-router-dom';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const ApplicationCard = () => {
  const { selectedApplication, selectApplication } = useApplication();
  const navigate = useNavigate();

  const options = [
    {
      id: 1,
      name: "Almoxarifado",
      image: "https://via.placeholder.com/300x300?text=Almoxarifado",
      organs: [
        { name: "Estoque", color: "#BF2626", hoverColor: "#A02222" },
        { name: "Fornecedores", color: "#5d8dbb", hoverColor: "#4a77a2" },
      ],
    },
    {
      id: 2,
      name: "Aluguel",
      image: "https://via.placeholder.com/300x300?text=Aluguel",
      organs: [
        { name: "ALUCOM", color: "#BF2626", hoverColor: "#A02222" },
        { name: "IP", color: "#5d8dbb", hoverColor: "#4a77a2" },
        { name: "MOREIA", color: "#FFA500", hoverColor: "#e69500" },
      ],
    },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]); 

  const handleSlideChange = (swiper) => {
    setSelectedOption(options[swiper.activeIndex]);
  };

  const handleAdvance = () => {
    selectApplication(selectedOption);
    navigate('/orgaos')
  };

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 mx-auto">
      <div className="card o-hidden border-0 shadow-lg">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="h4 font-color-blue-light">Selecione uma aplicação!</h1>
          </div>

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
            {options.map((option) => (
              <SwiperSlide key={option.id}>
                <div
                  className="d-flex align-items-end justify-content-center rounded shadow"
                  style={{
                    backgroundImage: `url(${option.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200px",
                    width: "200px",
                    margin: "0 auto",
                  }}
                >
                  <p className="text-white fw-bold text-shadow p-2 m-0">{option.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <Button
            text="Avançar"
            className="btn btn-blue-light w-100 d-flex align-items-center justify-content-center"
            onClick={handleAdvance} 
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
