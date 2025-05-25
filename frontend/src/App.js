import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      title: newTodo,
      completed: false
    };

    setTodos([todo, ...todos]);
    setNewTodo('');
    toast.success('Todo added successfully');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success('Todo deleted successfully');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo List
        </Typography>
        
        <form onSubmit={addTodo}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </form>

        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <IconButton onClick={() => toggleTodo(todo.id)}>
                <CheckCircleIcon color={todo.completed ? "success" : "action"} />
              </IconButton>
              <ListItemText
                primary={todo.title}
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <ToastContainer />
    </Container>
  );
}

export default App;