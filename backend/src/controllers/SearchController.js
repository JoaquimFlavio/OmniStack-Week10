const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response){
        const { latitude, longitude, techs } = request.query;

        //Trasforma a cadeia de Strings separadas por , para um array.
        const techsArray = parseStringAsArray(techs);

        //Realiza uma busca de todos os registros compativeis com os filtros.
        //Consultar documentaçao: https://docs.mongodb.com/manual/reference/method/db.collection.find/
        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            }
        })

        return response.json({ devs });
    }
}