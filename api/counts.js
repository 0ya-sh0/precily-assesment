const express = require('express');
const { getDb } = require('../db');

const counts = express.Router();

counts.get('/postTask', async (req, res) => {
    const db = getDb();
    const count = await db.collection('PostTaskRequests').count();
    res.json({ success: true, count, millis: (new Date() - req.API_START_MILLIS) });
});

counts.get('/putTask', async (req, res) => {
    const db = getDb();
    const count = await db.collection('PutTaskRequests').count();
    res.json({ success: true, count, millis: (new Date() - req.API_START_MILLIS) });
});

counts.get('/deleteTask', async (req, res) => {
    const db = getDb();
    const count = await db.collection('DeleteTaskRequests').count();
    res.json({ success: true, count, millis: (new Date() - req.API_START_MILLIS) });
});

module.exports = counts;