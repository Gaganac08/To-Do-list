import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <CircularProgress size={40} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingSpinner; 