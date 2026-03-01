export function registerSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('New Client Connected', socket.id)

        socket.on('disconnect', () => {
            console.log('Client Disconnected', socket.id)
        })
    })
}