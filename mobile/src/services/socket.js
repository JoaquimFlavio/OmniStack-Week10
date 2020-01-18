import socketio from 'socket.io-client';

const socket = socketio('http://192.168.1.100:3333', {
    autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction){
    //Toda vez que o servidor enviar uma mensagem com o titulo: 'new-dev'
    //a função passada pelos parametros será invocada.
    socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs,){
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };

    socket.connect();
}

function disconnect(){
    if(socket.connect){
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs
}