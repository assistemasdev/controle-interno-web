
const ItemContainerBox = ({ item, children }) => {
    return (
        <div className='d-flex align-items-center'>
            <p className="shadow-sm p-1 section bg-gray-200 d-flex align-items-center">
                <span className="me-2 d-flex align">{item.icon}</span> 
                <strong className="me-1">{item.label}:</strong> {item.value}
            </p>
        </div>
    );
};

export default ItemContainerBox;
