import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';

import AddTodoForm from '../components/AddTodoForm';   
import TodoList from '../components/TodoList';           
import SummaryButton from '../components/SummaryButton'; 

function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (session) {
      fetchTodos();
    }
  }, [session]);

  const fetchTodos = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setTodos(data);
    } else {
      console.error('Failed to fetch todos');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Todo Summary Assistant
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <AddTodoForm onAdd={(newTodo) => setTodos([...todos, newTodo])} />
        </Box>

        <TodoList
          todos={todos}
          onUpdate={setTodos}
          onDelete={(id) => setTodos(todos.filter((todo) => todo.id !== id))}
        />

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <SummaryButton />
        </Box>
      </Container>
    </>
  );
}

export default Home;
