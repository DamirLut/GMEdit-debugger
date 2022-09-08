export class EventEmitter {
  private events: Record<string, Function[]> = {};

  public on(event: string, callback: Function) {
    if (!(event in this.events)) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  public emit(event: string, ...args: any[]) {
    if (event in this.events) {
      this.events[event].forEach((callback) => {
        callback(...args);
      });
    }
  }
}
