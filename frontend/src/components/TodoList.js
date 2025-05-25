import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function TodoList({ todos, onToggle, onDelete, onEdit }) {
  const [todosState, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      toast.error('Failed to fetch todos');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todosState.filter(todo => todo.id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
      console.error('Error:', error);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const todo = todosState.find(t => t.id === id);
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          completed: !completed,
        }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      setTodos(todosState.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
      toast.success('Todo updated successfully');
    } catch (error) {
      toast.error('Failed to update todo');
      console.error('Error:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Todos
      </Typography>
      <List>
        {todosState.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              bgcolor: todo.completed ? 'action.hover' : 'background.paper',
              mb: 1,
              borderRadius: 1,
            }}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggle(todo.id, todo.completed)}
              color="primary"
            />
            <ListItemText
              primary={todo.title}
              secondary={todo.description}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => onEdit(todo)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(todo.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default TodoList;