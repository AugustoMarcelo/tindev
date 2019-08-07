const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

// Criando instância do express
const server = express();

mongoose.connect('mongodb+srv://tindev:tindev@cluster0-6xi6w.mongodb.net/omnistack8?retryWrites=true&w=majority', { 
	useNewUrlParser: true 
});

server.use(cors());
// Habilitando a utilização de json dentro do express
server.use(express.json());
// Use permite importar as configurações de outros arquivos/módulos
server.use(routes);
// Ouvindo a porta 3333
server.listen(3333);