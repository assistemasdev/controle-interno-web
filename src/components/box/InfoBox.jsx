const InfoBox = ({ data }) => {
    return (
        <div className="d-flex gap-3 flex-wrap">
            {data.map((item, index) => (
                <p key={index} className="shadow-sm p-1 section bg-gray-200 d-flex align-items-center">
                    <span className="me-2 d-flex align">{item.icon}</span> 
                    <strong className="me-1">{item.label}:</strong> {item.value}
                </p>
            ))}
        </div>
    );
};

export default InfoBox;
