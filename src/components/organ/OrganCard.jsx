import React, { useEffect, useState } from "react";
import Button from "../login/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useOrgan } from "../../hooks/useOrgan";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const OrganCard = () => {
  const { selectOrgan } = useOrgan();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const storedApplication = localStorage.getItem("selectedApplication");
    if (storedApplication) {
      const parsedApplication = JSON.parse(storedApplication);
      if (parsedApplication.organs) {
        setOptions(parsedApplication.organs);
        setSelectedOption(parsedApplication.organs[0]); 
      }
    }
  }, []);

  const handleSlideChange = (swiper) => {
    setSelectedOption(options[swiper.activeIndex]);
  };

  const handleAdvance = () => {
    selectOrgan(selectedOption);
    navigate("/dashboard");
  };

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 mx-auto">
      <div className="card o-hidden border-0 shadow-lg">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="h4 font-color-blue-light">Selecione uma aplicação!</h1>
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
            <div className="text-center">Nenhum órgão disponível.</div>
          )}

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

export default OrganCard;
