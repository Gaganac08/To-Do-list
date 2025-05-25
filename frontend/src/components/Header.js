import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';

function Header() {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white' }}>
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <AssignmentIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              Todo Summary Assistant
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header; 