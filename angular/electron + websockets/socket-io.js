module.exports = function(io) {
    io.on('connection', function (socket) {
        //console.log('test');

        socket.on('stateChange', function (data) {
            socket.broadcast.emit('to', { page: data.page, params: data.params });
        });

        socket.on('startAction', function (data) {
            socket.broadcast.emit('action', data);
        });

        socket.on('transitionerReady', function (data) {
            socket.broadcast.emit('transitionFinished', data);
        });
    });
};