import React from "react";

const ApplicationCard = ({ option }) => {
  return (
    <div
        className="d-flex align-items-end justify-content-center rounded shadow"
        style={{
          backgroundColor: "#cccccc",
          height: "200px",
          width: "200px",
          margin: "0 auto",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
      >
        <p className="text-white fw-bold text-shadow p-2 m-0">
          {option.name}
        </p>
      </div>
  );
};

export default ApplicationCard;
