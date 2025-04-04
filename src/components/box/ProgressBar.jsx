import React from "react";

const ProgressBar = ({ progress }) => {
    const getColor = (progress) => {
        if (progress < 40) {
            return '#ff0000'; 
        } else if (progress < 70) {
            return '#ffcc00'; 
        } else {
            return '#28a745';
        }
    };

    return (
        <div 
            style={{ 
                width: '100%', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '9999px', 
                height: '24px', 
                overflow: 'hidden', 
                position: 'relative' 
            }}
        >
            <div
                style={{
                    width: `${Math.min(Math.max(progress, 0), 100)}%`,
                    backgroundColor: getColor(progress),
                    height: '100%',
                    transition: 'width 0.3s ease',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    fontWeight: 'bold',
                    lineHeight: '24px',
                }}
            >
                {`${(Math.min(Math.max(progress, 0), 100)).toFixed(2)}%`}
            </div>
        </div>
    );
};

export default ProgressBar;
