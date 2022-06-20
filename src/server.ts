require('dotenv/config');

const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


import App from './App';

App(io);

server.listen(process.env.PORT || 4000, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT ? process.env.PORT : 4000}`);
});