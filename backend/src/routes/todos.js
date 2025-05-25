const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
const axios = require('axios');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Get all todos
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new todo
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;
        const { data, error } = await supabase
            .from('todos')
            .insert([{ title, description }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a todo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const { data, error } = await supabase
            .from('todos')
            .update({ title, description, completed })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate and send summary to Slack
router.post('/summarize', async (req, res) => {
    try {
        // Get all incomplete todos
        const { data: todos, error } = await supabase
            .from('todos')
            .select('*')
            .eq('completed', false)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (todos.length === 0) {
            return res.json({ message: 'No pending todos to summarize' });
        }

        // Generate summary using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes todo lists in a concise and actionable way."
                },
                {
                    role: "user",
                    content: `Please summarize these pending todos in a concise and actionable way: ${JSON.stringify(todos)}`
                }
            ],
            max_tokens: 150
        });

        const summary = completion.choices[0].message.content;

        // Send to Slack
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
            text: `📋 *Todo Summary*\n${summary}`
        });

        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;