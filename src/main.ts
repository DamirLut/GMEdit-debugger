import { Debugger } from './Debugger/index.js';
import { Server } from './Server/Server.js';

export enum GMEditModule {
  Console,
}

GMEdit.register('Debugger', {
  init(state) {
    const server = new Server(require(state.dir + '/node_modules/ws/index.js'));

    GMEdit.on('projectOpen', () => {
      const debug = new Debugger(state.dir + '/node_modules/');
      server.on('connect', (client) => {
        client.on('message', (message: Uint8Array) => {
          const id: GMEditModule = message[0];
          debug.process(id, message.slice(1));
        });
      });
      server.on('disconnect', (client) => {});
    });
  },
});
