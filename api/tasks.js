const express = require('express');
const { getDb } = require('../db');
const { ObjectId } = require('mongodb');

const tasks = express.Router();

tasks.get('/', async (req, res) => {
    const db = getDb();
    const tasks = await db.collection('Tasks').find({}).toArray();
    res.json({ success: true, tasks, millis: (new Date() - req.API_START_MILLIS) });
});

tasks.delete('/:id', async (req, res) => {
    const db = getDb();
    const result = await db.collection('Tasks').deleteOne({ _id: ObjectId(req.params.id) });
    console.log('Delete Task', req.params.id, result);
    if (result.deletedCount === 1) {
        await db.collection('DeleteTaskRequests').insertOne({ time: new Date() });
        const count = await db.collection('DeleteTaskRequests').count();
        res.json({ success: true, count, deletedCount: result.deletedCount, millis: (new Date() - req.API_START_MILLIS) });
        return;
    }
    const count = await db.collection('DeleteTaskRequests').count();
    res.json({ success: false, count, deletedCount: result.deletedCount, millis: (new Date() - req.API_START_MILLIS) });
})

tasks.put('/:id', async (req, res) => {
    const db = getDb();
    const text = req.body.text;
    const id = req.params.id;
    const result = await db.collection('Tasks').updateOne({ _id: ObjectId(id) }, { "$set": { "text": text } });
    if (result.modifiedCount === 1) {
        const task = await db.collection('Tasks').findOne({ _id: ObjectId(id) });
        console.log('Edit Task', req.params.id, result, task);
        await db.collection('PutTaskRequests').insertOne({ time: new Date() });
        const count = await db.collection('PutTaskRequests').count();
        res.json({ success: true, task, count, modifiedCount: result.modifiedCount, millis: (new Date() - req.API_START_MILLIS) });
        return;
    }
    const count = await db.collection('PutTaskRequests').count();
    res.json({ success: false, count, modifiedCount: result.modifiedCount, millis: (new Date() - req.API_START_MILLIS) });
})

tasks.post('/', async (req, res) => {
    if (!req.body.text) {
        res.status(401).json({ success: false, msg: "empty text", millis: (new Date() - req.API_START_MILLIS) });
        return;
    }
    const db = getDb();
    const result = await db.collection('Tasks').insertOne({ text: req.body.text });
    const task = await db.collection('Tasks').findOne({ _id: result.insertedId });
    console.log('Inserted Task', task);
    await db.collection('PostTaskRequests').insertOne({ time: new Date() });
    const count = await db.collection('PostTaskRequests').count();
    res.json({ success: true, task, count, millis: (new Date() - req.API_START_MILLIS) });
});

module.exports = tasks;