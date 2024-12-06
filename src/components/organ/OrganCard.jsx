import React from "react";

const OrganCard = ({ organ }) => {
    return (
        <div
            className="d-flex align-items-end justify-content-center rounded shadow"
            style={{
                backgroundColor: organ.color,
                height: "200px",
                width: "200px",
                margin: "0 auto",
                cursor: "pointer",
                transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = organ.hoverColor)
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = organ.color)
            }
        >
            <p className="text-white fw-bold text-shadow p-2 m-0">
                {organ.name}
            </p>
        </div>
    );
};

export default OrganCard;
