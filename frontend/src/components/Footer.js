import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Built with ❤️ using '}
          <Link color="inherit" href="https://reactjs.org/">
            React
          </Link>
          {' and '}
          <Link color="inherit" href="https://mui.com/">
            Material-UI
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          {'© '}
          {new Date().getFullYear()}
          {' Todo Summary Assistant. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 