import React from "react";
import { FaPuzzlePiece } from "react-icons/fa";

const AccessoriesListBox = ({ accessories = [] }) => {
    if (!accessories.length) return null;

    return (
        <div
            className="my-2 p-3 shadow-sm rounded"
            style={{
                backgroundColor: "#f8f9fa", 
                border: "1px solid #dee2e6"
            }}
        >
            <h5 className="fw-semibold mb-3 text-uppercase" style={{ color: "#343a40" }}>
                Acessórios
            </h5>

            <ul
                className="list-group"
                style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px"
                }}
            >
                {accessories.map((accessory, index) => (
                    <li
                        key={accessory.id || index}
                        className="list-group-item d-flex align-items-center"
                    >
                        <FaPuzzlePiece className="me-2 text-muted" />
                        <span>{accessory.name || "Sem nome"}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AccessoriesListBox;
