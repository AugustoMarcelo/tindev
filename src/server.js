const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

// Criando instância do express
const serverHTTP = express();
// Extraindo o módulo de HTTP do Node e unindo ao servidor WEBSOCKET
const serverWEBSOCKET = require('http').Server(serverHTTP);
const io = require('socket.io')(serverWEBSOCKET);

const connectedUsers = {};

io.on('connection', socket => {
	const { user } = socket.handshake.query;

	connectedUsers[user] = socket.id
});

mongoose.connect('mongodb+srv://tindev:tindev@cluster0-6xi6w.mongodb.net/omnistack8?retryWrites=true&w=majority', { 
	useNewUrlParser: true 
});

/** 
 * Middleware utilizado para interceptar as requisições, 
 * salvar instância do socket e os usuários conectados
 * e repassar para os controllers
 */
serverHTTP.use((request, response, next) => {
	request.io = io;
	request.connectedUsers = connectedUsers;

	// Segue o fluxo das rotas normalmente
	return next();
});

serverHTTP.use(cors());
// Habilitando a utilização de json dentro do express
serverHTTP.use(express.json());
// Use permite importar as configurações de outros arquivos/módulos
serverHTTP.use(routes);
// Ouvindo a porta 3333 e habilitando servidor para atender a requisições HTTP e WEBSOCKET
serverWEBSOCKET.listen(3333);