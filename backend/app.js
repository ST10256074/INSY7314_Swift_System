import http from 'http';
import express from "express";

const app = express();
const urlprefix = '/api';

const PORT = 3005;

app.get('/', (req, res) => {
    res.send('I am finally figuring this out!');
})

app.get('/test', (req, res) => {
    res.send('This is a test route!');
})

app.get(urlprefix + '/orders', (req, res) => {
    const orders = [
        { id: 1, item: 'Pizza', quantity: 2 },
        { id: 2, item: 'Burger', quantity: 1 },
        { id: 3, item: 'Soda', quantity: 3 }
    ];
    res.json(orders);
})

app.listen(PORT)