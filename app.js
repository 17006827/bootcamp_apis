const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api/word_game', (req, res) => {
    const sentence = req.query.sentence;
    if (!sentence) {
        return res.status(400).json({ error: 'No sentence provided' });
    }

    const words = sentence.split(' ');
    const longestWord = Math.max(...words.map(word => word.length));
    const shortestWord = words.reduce((shortest, word) => word.length < shortest.length ? word : shortest, words[0]);
    const sum = words.reduce((total, word) => total + word.length, 0);

    res.json({
        longestWord,
        shortestWord,
        sum
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
// --------------------------------------------------------
let callPrice = 2.75;
let smsPrice = 0.65;

app.post('/api/phonebill/total', (req, res) => {
    const { bill } = req.body;
    if (!bill) {
        return res.status(400).json({ error: 'No bill provided' });
    }

    const actions = bill.split(',');
    const total = actions.reduce((sum, action) => {
        if (action === 'call') return sum + callPrice;
        if (action === 'sms') return sum + smsPrice;
        return sum;
    }, 0);

    res.json({ total });
});

app.get('/api/phonebill/prices', (req, res) => {
    res.json({ call: callPrice, sms: smsPrice });
});

app.post('/api/phonebill/price', (req, res) => {
    const { type, price } = req.body;
    if (type === 'call') {
        callPrice = parseFloat(price);
        res.json({ status: 'success', message: `The call price was set to ${callPrice}` });
    } else if (type === 'sms') {
        smsPrice = parseFloat(price);
        res.json({ status: 'success', message: `The sms price was set to ${smsPrice}` });
    } else {
        res.status(400).json({ error: 'Invalid type' });
    }
});
// --------------------------------------------------------
app.post('/api/enough', (req, res) => {
    const { usage, available } = req.body;
    if (!usage || available === undefined) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const actions = usage.split(',');
    const total = actions.reduce((sum, action) => {
        if (action === 'call') return sum + callPrice;
        if (action === 'sms') return sum + smsPrice;
        return sum;
    }, 0);

    const result = available - total;
    res.json({ result });
});

const path = require('path');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
//  http://localhost:3000/filename.html
// https://youtu.be/ALPLZqWqF38?si=Cd6ybODnZkYFRRjv
