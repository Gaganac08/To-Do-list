require('dotenv').config(); // Make sure environment variables are loaded

const { OpenAI } = require('openai');

// Ensure the API key is set before creating the client
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeTodos(todos) {
  const todoList = todos.map(todo => todo.title).join(', ');
  const prompt = `Summarize the following pending tasks in a concise sentence: ${todoList}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI summarization failed:', error.message);
    throw new Error('Failed to generate summary from OpenAI');
  }
}

module.exports = { summarizeTodos };
