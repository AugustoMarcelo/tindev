const express = require('express');
const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

const routes = express.Router();

// Rota para lsitar os devs que o usuário logado não deu like ou dislike
routes.get('/devs', DevController.index);
// Rota para cadastro de novos devs
routes.post('/devs', DevController.store);

// Rota para dar like no desenvolvedor
routes.post('/devs/:devId/likes', LikeController.store);
// Rota para dar dislike no desenvolvedor
routes.post('/devs/:devId/dislikes', DislikeController.store);

module.exports = routes;