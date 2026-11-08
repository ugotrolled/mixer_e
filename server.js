const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Мок-эндпоинты для API (чтобы фронтенд получал данные без ошибок сети)
app.get('/api/prices', (req, res) => {
    res.json({
        btc: 75852,
        eth: 2235,
        usdt: 1.0,
        usdc: 1.0,
        bnb: 697.30,
        sol: 189.31,
        zec: 45.0,
        ltc: 85.0
    });
});

app.post('/api/submit', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Order processed successfully',
        data: req.body 
    });
});

// SPA Fallback: перенаправление всех остальных запросов на index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
