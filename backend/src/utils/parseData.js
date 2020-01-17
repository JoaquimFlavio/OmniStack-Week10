const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('./parseStringAsArray');
const {findConnections} = require('../websocket');

module.exports = async function parseData (data) {
    const { github_username, techs, latitude, longitude } = data;

    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

    const { name = login, avatar_url, bio } = apiResponse.data;
        
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