const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('./parseStringAsArray');

module.exports = async function parseData (data) {
    const { github_username, techs, latitude, longitude } = data;

    //Solicita os dados do usuario à API do GitHub.
    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    const { name = login, avatar_url, bio } = apiResponse.data;
        
    //Trasforma a cadeia de Strings separadas por , para um array.
    const techsArray = parseStringAsArray(techs);

    const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
    };

    return {
        github_username, 
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
    };
}