import * as WsTypes from 'ws/index';
import { EventEmitter } from '../ToolKits.js';

export interface Server {
  on(event: 'connect', callback: (client: WsTypes.WebSocket) => void);
  on(event: 'disconnect', callback: (client: WsTypes.WebSocket) => void);
}

export class Server extends EventEmitter {
  private ws: WsTypes.Server;

  public clients: WsTypes.WebSocket[] = [];

  constructor(ws) {
    super();
    console.log('Starting debugger...');
    this.ws = new ws.Server({
      port: 54321,
    });

    this.ws.on('connection', this.onConnect.bind(this));

    console.log('Debugger started at', this.ws.options.port);
  }

  private onConnect(socket: WsTypes.WebSocket) {
    this.clients.push(socket);
    this.emit('connect', socket);

    socket.on('close', () => {
      this.emit('disconnect', socket);
      this.clients = this.clients.filter((client) => client != socket);
    });
  }
}
