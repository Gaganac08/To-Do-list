const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { summarizeTodos } = require('../services/llm');
const { sendToSlack } = require('../services/slack');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No authorization token provided');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: todos, error } = await supabase
      .from('todos')
      .select('title')
      .eq('completed', false);
    if (error) throw error;
    if (todos.length === 0) {
      await sendToSlack('No pending tasks to summarize.');
      return res.json({ message: 'No pending tasks.' });
    }
    const summary = await summarizeTodos(todos);
    await sendToSlack(summary);
    res.json({ message: 'Summary sent to Slack' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;