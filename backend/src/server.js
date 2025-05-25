const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'HTTP-Referer': process.env.OPENROUTER_REFERER || '',
    'X-Title': process.env.OPENROUTER_TITLE || ''
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Todo Summary API is running' });
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
      return res.status(500).json({ error: 'Failed to fetch todos' });
    }

    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title,
          description: description || '',
          completed: false
        }
      ])
      .select();

    if (error) {
      console.error('Error creating todo:', error);
      return res.status(500).json({ error: 'Failed to create todo' });
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating todo:', error);
      return res.status(500).json({ error: 'Failed to update todo' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      return res.status(500).json({ error: 'Failed to delete todo' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Summarize todos and send to Slack
app.post('/api/summarize', async (req, res) => {
  try {
    // Fetch all pending todos
    const { data: todos, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('completed', false)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching todos:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch todos' });
    }

    if (todos.length === 0) {
      return res.status(400).json({ error: 'No pending todos to summarize' });
    }

    // Prepare todo list for LLM
    const todoList = todos.map((todo, index) => 
      `${index + 1}. ${todo.title}${todo.description ? ` - ${todo.description}` : ''}`
    ).join('\n');

    // Generate summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise, actionable summaries of todo lists. Focus on priorities, themes, and actionable insights."
        },
        {
          role: "user",
          content: `Please create a brief, actionable summary of the following todo list:\n\n${todoList}\n\nInclude:\n- Key themes or categories\n- Priority items\n- Any suggestions for organization or next steps`
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const summary = completion.choices[0].message.content;

    // Send to Slack
    const slackMessage = {
      text: "📋 Todo Summary",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📋 Todo Summary Assistant"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Pending Todos (${todos.length}):*\n${todoList}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*AI Summary:*\n${summary}`
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Generated on ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };

    await axios.post(process.env.SLACK_WEBHOOK_URL, slackMessage);

    res.json({ 
      message: 'Summary generated and sent to Slack successfully',
      summary,
      todoCount: todos.length
    });

  } catch (error) {
    console.error('Error in summarize endpoint:', error);
    
    if (error.response && error.response.status === 404) {
      return res.status(400).json({ error: 'Slack webhook URL is invalid' });
    }
    
    if (error.code === 'insufficient_quota') {
      return res.status(400).json({ error: 'OpenAI API quota exceeded' });
    }
    
    res.status(500).json({ error: 'Failed to generate summary or send to Slack' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});