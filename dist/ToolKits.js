export class EventEmitter {
    events = {};
    on(event, callback) {
        if (!(event in this.events)) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    emit(event, ...args) {
        if (event in this.events) {
            this.events[event].forEach((callback) => {
                callback(...args);
            });
        }
    }
}
//# sourceMappingURL=ToolKits.js.map