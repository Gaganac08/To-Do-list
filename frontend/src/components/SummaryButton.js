import React from 'react';
import { Button, Paper, Typography } from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';

const SummaryButton = ({ onGenerateSummary, loading }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Generate Summary
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<SummarizeIcon />}
        onClick={onGenerateSummary}
        disabled={loading}
        fullWidth
      >
        {loading ? 'Generating Summary...' : 'Generate Summary'}
      </Button>
    </Paper>
  );
};

export default SummaryButton;