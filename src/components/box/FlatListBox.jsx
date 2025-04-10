import React, { useState, useRef, useEffect } from "react";
import ItemContainerBox from "./ItemContainerBox";
import { FaChevronRight } from "react-icons/fa";

const FlatListBox = ({ title, data = [], accessories = null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState("0px");
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
        }
    }, [isOpen]);

    const toggleOpen = () => setIsOpen(prev => !prev);

    return (
        <div
            className="my-2 p-3 shadow-sm rounded"
            style={{
                backgroundColor: "#f8f9fa", // leve cinza
                border: "1px solid #dee2e6"
            }}
        >
            <div
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={toggleOpen}
                style={{
                    userSelect: "none",
                    backgroundColor: "#e9ecef",
                    padding: "8px 12px",
                    borderRadius: "6px"
                }}
            >
                <h5 className="fw-semibold mb-0 text-uppercase" style={{ color: "#343a40" }}>
                    {title}
                </h5>
                <div
                    style={{
                        transition: "transform 0.3s ease",
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        color: "#6c757d"
                    }}
                >
                    <FaChevronRight />
                </div>
            </div>

            <div
                ref={contentRef}
                style={{
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                    height: height
                }}
            >
                <div
                    className="d-grid gap-2 mt-3 p-2 rounded"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        backgroundColor: "#ffffff", 
                        border: "1px solid #dee2e6"
                    }}
                >
                    {data.map((item, index) =>
                        item.value ? (
                            item.icon ? (
                                <ItemContainerBox key={index} item={item} />
                            ) : (
                                <div key={index} className="d-flex text-muted small">
                                    <strong className="me-2 text-dark">{item.label}:</strong>
                                    <span>{item.value}</span>
                                </div>
                            )
                        ) : null
                    )}
                </div>
                {accessories && (
                    accessories
                )}
            </div>
        </div>
    );
};

export default FlatListBox;
