import { EventEmitter } from '../ToolKits.js';
export class Server extends EventEmitter {
    ws;
    clients = [];
    constructor(ws) {
        super();
        console.log('Starting debugger...');
        this.ws = new ws.Server({
            port: 54321,
        });
        this.ws.on('connection', this.onConnect.bind(this));
        console.log('Debugger started at', this.ws.options.port);
    }
    onConnect(socket) {
        this.clients.push(socket);
        this.emit('connect', socket);
        socket.on('close', () => {
            this.emit('disconnect', socket);
            this.clients = this.clients.filter((client) => client != socket);
        });
    }
}
//# sourceMappingURL=Server.js.map