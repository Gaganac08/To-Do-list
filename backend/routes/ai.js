const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' // Replace with your actual API key
});

// AI suggestion endpoint
router.post('/suggest', async (req, res) => {
  try {
    const { todos } = req.body;

    const prompt = `Based on the following todo list, suggest a new task that would be helpful to add:
    ${todos.map(todo => `- ${todo.title}: ${todo.description || 'No description'}`).join('\n')}
    
    Please suggest a relevant task that would complement the existing tasks.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful task management assistant. Provide concise and relevant task suggestions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const suggestion = completion.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (error) {
    console.error('Error generating AI suggestion:', error);
    res.status(500).json({ error: 'Failed to generate AI suggestion' });
  }
});

router.post('/summarize', async (req, res) => {
  try {
    const { todos } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes todo lists. Provide a concise summary of the tasks, highlighting completed and pending items."
        },
        {
          role: "user",
          content: `Please summarize these tasks:\n${todos}`
        }
      ],
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router; 