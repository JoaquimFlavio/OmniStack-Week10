const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
var connections = []

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    });
};

exports.findConnections = (coordinates, techs) => {
    //Retorna todas as conecções aonde a distancia seja menor que 10km 
    //e tenha ao menos uma tecnologia do filtro.
    return connections.filter(connections => {
        return calculateDistance(coordinates, connections.coordinates) < 10
               && connections.techs.some(item => techs.includes(item))
    })
}

exports.sendMessage = (to, message, data) => {
    //Envia a mensagem a todas as conexções validas.
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
}