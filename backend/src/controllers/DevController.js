const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const parseData = require('../utils/parseData');

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