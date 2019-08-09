const Dev = require('../models/Dev');

module.exports = {
	async store(req, res) {
		// Recuperando o id do usuário logado do cabeçalho
		const { user } = req.headers;
		// Recuperando o id do usuário que está recebendo like da url
		const { devId } = req.params;

		// Buscando informações do usuário logado no banco
		const loggedDev = await Dev.findById(user);
		// Buscando informações do usuário que está recebendo like no banco
		const targetDev = await Dev.findById(devId);

		// Verificando se o usuário não existe
		if (!targetDev) {
			return res.status(400).json({ error: 'Dev not exists' });
		}

		// Verificando se o usuário que recebeu like já tinha dado like no usuário logado
		if (targetDev.likes.includes(loggedDev._id)) {
			// Busca o socket do usuário logado
			const loggedSocket = req.connectedUsers[user];
			// Busca o socket do usuário que recebeu like
			const targetSocket = req.connectedUsers[devId];

			// Verifica se o usuário está conectado na aplicação
			if (loggedSocket) {
				// Avisa ao usuário logado que ocorreu um match no momento do like
				req.io.to(loggedSocket).emit('match', targetDev);
			}

			// Verifica se o usuário está conectado na aplicação
			if (targetSocket) {
				// Avisa ao usuário que recebeu o like que ocorreu um match
				req.io.to(targetSocket).emit('match', loggedDev);
			}	
		}
		
		// Adicionando o like no array
		loggedDev.likes.push(targetDev._id);
		// Salvando as alterações no banco
		await loggedDev.save();

		return res.json(loggedDev);
	}
};