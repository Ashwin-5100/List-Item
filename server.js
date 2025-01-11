const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

let expenses = [];

app.get('/api/expenses', (req, res) => {
    res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
    const { name, amount, category, date } = req.body;
    if (name && amount && category && date) {
        const newExpense = { id: expenses.length + 1, name, amount, category, date };
        expenses.push(newExpense);
        res.status(201).json(newExpense);
    } else {
        res.status(400).json({ message: 'All fields are required' });
    }
});

app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    expenses = expenses.filter(expense => expense.id != id);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
