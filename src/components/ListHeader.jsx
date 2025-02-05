import React from 'react';
import Button from './Button';

const ListHeader = ({ title, buttonText, buttonLink, canAccess, permission }) => {
    return (
        <div className="form-row mt-4 d-flex justify-content-between align-items-center">
            <div className="font-weight-bold text-primary text-uppercase mb-1 d-flex">
                {title}
            </div>
            {canAccess(permission) && (
                <Button
                    text={buttonText}
                    className="btn btn-blue-light fw-semibold"
                    link={buttonLink}
                />
            )}
        </div>
    );
};

export default ListHeader;
