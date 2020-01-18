const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const parseData = require('../utils/parseData');
const {findConnections, sendMessage} = require('../websocket');

/*
 * index: Obtem todos os dados
 * show: Obtem dados filtrados
 * store: Armazena os dados
 * update: Atualiza determinado dados
 * destroy: Apaga determinado dado
 */ 

module.exports = {
    async index(request, response){
        //Busca no MongoDB todos os registros do modelo.
        const devs = await Dev.find();

        return response.json(devs);
    },
    async store(request, response) {
        const { github_username } = request.body;

        //Procura se existe ao menos um registro com o mesmo username.
        let dev = await Dev.findOne({github_username});

        if(!dev) {
            //Organiza os dados para o formato de dados do MongoDB.
            const mydata = await parseData(request.body);

            //Insere o dado no MongoDB atraves do model.
            dev = await Dev.create(mydata);

            //Obtem novamente os dados necessarios para se trabalhar com o WebSockts.
            const {techs} = mydata;
            const longitude = mydata.location.coordinates[0];
            const latitude = mydata.location.coordinates[1];

            // Filtrar as conexões que estão ha no maximo 10km de distancia
            // e que o novo dev tenha pelo menos uma das tecnologias cadastradas
            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techs,
            );
  
            //Envia a mensagem as conexoes WebSockets.
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
             
            //Mostra os clientes conectados.
            console.log(sendSocketMessageTo);
        }        
    
        return response.json(dev);
    },
    async update(request, response) {
        const { github_username } = request.body;

        //Organiza os dados para o formato de dados do MongoDB.
        const mydata = await parseData(request.body.new);

        //Procura se existe ao menos um registro com o mesmo username e então o atualiza.
        let dev = await Dev.findOneAndUpdate({github_username}, mydata);
    
        return response.json(dev);
    },
    async destroy(request, response){
        const { github_username } = request.body;
        
        //Deleta todos os registros no MongoDB que tenham o msm username.
        const dev = await Dev.deleteMany({
            github_username
        });

        return response.json(dev);
    },
};