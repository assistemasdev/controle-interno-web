const DynamicBoxForm = ({ title, children }) => {
    return (
        <div className="border rounded-lg p-3 shadow-sm bg-white">
            <div className='d-flex align-items-end mb-3'>
                <h5 className='mb-0 text-dark fw-bold section-border'>
                    {title}
                </h5> 
            </div>
            <div>{children}</div>
        </div>
    );
};

export default DynamicBoxForm;
