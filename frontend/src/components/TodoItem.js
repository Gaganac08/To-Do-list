import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Checkbox, IconButton, TextField, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const session = useSession();

  const handleToggle = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (response.ok) {
      onUpdate({ ...todo, completed: !todo.completed });
    }
  };

  const handleSave = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title: editedTitle }),
    });
    if (response.ok) {
      onUpdate({ ...todo, title: editedTitle });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todo.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (response.ok) {
      onDelete(todo.id);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
      <Checkbox checked={todo.completed} onChange={handleToggle} />
      {isEditing ? (
        <>
          <TextField
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <IconButton onClick={handleSave} color="primary">
            <SaveIcon />
          </IconButton>
          <IconButton onClick={() => setIsEditing(false)}>
            <CancelIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography sx={{ flexGrow: 1, textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
          </Typography>
          <IconButton onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
}

export default TodoItem;
