import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Check as CheckIcon,
  Summarize as SummarizeIcon,
  Edit as EditIcon,
  Star as StarIcon,
  Work as WorkIcon,
  ShoppingCart as ShoppingIcon,
  Favorite as HealthIcon,
  More as OtherIcon
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  priority: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1dcb',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const categories = [
  { value: 'work', label: 'Work', color: '#7c4dff' },
  { value: 'personal', label: 'Personal', color: '#ff4081' },
  { value: 'shopping', label: 'Shopping', color: '#00bcd4' },
  { value: 'health', label: 'Health', color: '#4caf50' },
  { value: 'other', label: 'Other', color: '#ff9800' }
];

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    byCategory: {} as Record<string, number>,
    byPriority: {} as Record<string, number>
  });

  useEffect(() => {
    updateStats();
  }, [todos]);

  const updateStats = () => {
    const newStats = {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      pending: todos.filter(t => !t.completed).length,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>
    };

    todos.forEach(todo => {
      if (todo.category) {
        newStats.byCategory[todo.category] = (newStats.byCategory[todo.category] || 0) + 1;
      }
      if (todo.priority) {
        newStats.byPriority[todo.priority] = (newStats.byPriority[todo.priority] || 0) + 1;
      }
    });

    setStats(newStats);
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        category,
        priority,
      };
      setTodos([...todos, todo]);
      setNewTodo('');
      toast.success('✨ Todo added successfully!');
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.error('🗑️ Todo deleted!');
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const pendingTodos = todos.filter(todo => !todo.completed);
      const highPriority = pendingTodos.filter(t => t.priority === 'high');
      const mediumPriority = pendingTodos.filter(t => t.priority === 'medium');
      const lowPriority = pendingTodos.filter(t => t.priority === 'low');

      const summary = `📊 Task Summary:\n\n` +
        `Total Tasks: ${todos.length}\n` +
        `Completed: ${stats.completed}\n` +
        `Pending: ${stats.pending}\n\n` +
        `🚨 High Priority (${highPriority.length}):\n` +
        highPriority.map(t => `- ${t.text} (${t.category})`).join('\n') + '\n\n' +
        `⚠️ Medium Priority (${mediumPriority.length}):\n` +
        mediumPriority.map(t => `- ${t.text} (${t.category})`).join('\n') + '\n\n' +
        `✅ Low Priority (${lowPriority.length}):\n` +
        lowPriority.map(t => `- ${t.text} (${t.category})`).join('\n') + '\n\n' +
        `📈 Category Distribution:\n` +
        Object.entries(stats.byCategory)
          .map(([cat, count]) => `- ${cat}: ${count} tasks`)
          .join('\n');
      
      setSummary(summary);
      setSummaryOpen(true);
    } catch (error) {
      toast.error('Failed to generate summary');
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="app-background">
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" className="gradient-text">
              ✨ Todo Summary Assistant
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card className="stats-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>📊 Progress</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Completed: {stats.completed} / {stats.total}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.completed / stats.total) * 100 || 0}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending Tasks: {stats.pending}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }} className="add-todo-card">
                  <form onSubmit={(e) => { e.preventDefault(); handleAddTodo(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <TextField
                      fullWidth
                      label="Add a new todo"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      variant="outlined"
                      className="custom-input"
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={category}
                          label="Category"
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={priority}
                          label="Priority"
                          onChange={(e) => setPriority(e.target.value)}
                        >
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      startIcon={<AddIcon />}
                      fullWidth
                      className="add-button"
                    >
                      Add Todo
                    </Button>
                  </form>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={generateSummary}
                startIcon={loading ? <CircularProgress size={20} /> : <SummarizeIcon />}
                disabled={loading || todos.length === 0}
                className="summary-button"
              >
                Generate Summary
              </Button>
            </Box>

            <List className="todo-list">
              {todos.map(todo => (
                <Paper 
                  key={todo.id} 
                  elevation={2} 
                  className="todo-item"
                >
                  <ListItem>
                    <IconButton onClick={() => handleToggleTodo(todo.id)} className="check-button">
                      <CheckIcon color={todo.completed ? "primary" : "action"} />
                    </IconButton>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            sx={{
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              color: todo.completed ? 'text.secondary' : 'text.primary',
                            }}
                          >
                            {todo.text}
                          </Typography>
                          <Chip 
                            label={category}
                            size="small"
                            sx={{
                              backgroundColor: categories.find(c => c.value === category)?.color,
                              color: 'white',
                            }}
                          />
                          <Chip 
                            label={priority}
                            size="small"
                            sx={{
                              backgroundColor:
                                priority === 'high'
                                  ? '#f44336'
                                  : priority === 'medium'
                                  ? '#ff9800'
                                  : '#4caf50',
                              color: 'white',
                            }}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteTodo(todo.id)} className="delete-button">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>

          <Dialog 
            open={summaryOpen} 
            onClose={() => setSummaryOpen(false)} 
            maxWidth="sm" 
            fullWidth
            className="summary-dialog"
          >
            <DialogTitle className="dialog-title">
              <SummarizeIcon sx={{ mr: 1 }} />
              AI-Generated Summary
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }} className="summary-text">
                {summary}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSummaryOpen(false)} className="close-button">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <ToastContainer 
            position="bottom-right"
            theme="colored"
            className="toast-container"
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 