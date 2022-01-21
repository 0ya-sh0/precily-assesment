const express = require('express');
const { connectToDb } = require('./db');

const app = express();

app.use('/api', require('./api'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
});

app.get('*', (req, res) => {
    res.redirect('/');
});

connectToDb().then(() => {
    console.log('Connected to Mongo');
    const PORT = 4000;
    app.listen(PORT, () => { console.log(`Task API Started On ${PORT}`) });
});

