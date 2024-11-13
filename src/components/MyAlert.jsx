import React, { useEffect, useState } from 'react';
import { Alert, Stack } from '@mui/material';

const MyAlert = ({ severity, message, onClose }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false); 
    }, 5000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    showAlert && (
      <Stack sx={{ width: '100%', marginBottom: 2 }} spacing={2}>
        <Alert
          variant="filled"  
          severity={severity} 
          onClose={onClose}  
        >
          {message}
        </Alert>
      </Stack>
    )
  );
};

export default MyAlert;
