const ItemContainerBox = ({ item }) => {
    return (
        <div className="bg-gray-700 text-white rounded p-2 shadow-sm d-flex flex-column gap-2 justify-content-between">
            <div className="d-flex align-items-center gap-2">
                <span className="text-warning">{item.icon}</span>
                <strong>{item.label}:</strong>
            </div>
            <span className="bg-warning text-dark px-2 py-1 rounded-pill fw-bold">
                {item.value}
            </span>
        </div>
    );
};

export default ItemContainerBox;
