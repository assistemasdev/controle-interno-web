const ContainerBox = ({ title, children }) => {
    return (
        <div>
            <div className='d-flex align-items-end mb-3'>
                <h5 className='mb-0 text-dark fw-bold section-border'>
                    {title}
                </h5> 
            </div>
            {children}
        </div>
    );
};

export default ContainerBox;
