import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AddTodoForm = ({ onAdd }) => {
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newTodo.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) throw new Error('Failed to add todo');

      const addedTodo = await response.json();
      toast.success('Todo added successfully');
      
      onAdd(addedTodo);
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      toast.error('Failed to add todo');
      console.error('Error:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add New Todo
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          sx={{ mb: 2 }}
          multiline
          rows={2}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Add Todo
        </Button>
      </Box>
    </Paper>
  );
};

export default AddTodoForm;
