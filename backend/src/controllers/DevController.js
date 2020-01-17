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
        const devs = await Dev.find();
        return response.json(devs);
    },
    async store(request, response) {
        const { github_username } = request.body;

        let dev = await Dev.findOne({github_username});

        if(!dev) {
            const mydata = await parseData(request.body);

            dev = await Dev.create(mydata);


            const {techs} = mydata;
            const longitude = mydata.location.coordinates[0];
            const latitude = mydata.location.coordinates[1];
            // Filtrar as conexões que estão ha no maximo 10km de distancia
            // e que o novo dev tenha pelo menos uma das tecnologias cadastradas
            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techs,
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
            
            console.log(sendSocketMessageTo);
        }        
    
        return response.json(dev);
    },
    async update(request, response) {
        const { github_username } = request.body;

        const mydata = await parseData(request.body.new);

        let dev = await Dev.findOneAndUpdate({github_username}, mydata);
    
        return response.json(dev);
    },
    async destroy(request, response){
        const { github_username } = request.body;
 
        const dev = await Dev.deleteMany({
            github_username
        });

        return response.json(dev);
    },
};