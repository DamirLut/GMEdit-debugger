var ConsoleEvent;
(function (ConsoleEvent) {
    ConsoleEvent[ConsoleEvent["Log"] = 0] = "Log";
    ConsoleEvent[ConsoleEvent["Surface"] = 1] = "Surface";
})(ConsoleEvent || (ConsoleEvent = {}));
export class Console {
    container;
    events = {};
    JSONTreeView;
    constructor(container, node_modules) {
        this.container = container;
        this.JSONTreeView = require(node_modules + 'json-tree-view/JSONView.js');
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = node_modules + 'json-tree-view/devtools.css';
        document.head.appendChild(link);
        this.events[ConsoleEvent.Log] = this.log.bind(this);
        this.events[ConsoleEvent.Surface] = this.surface.bind(this);
    }
    process(data) {
        const id = data[0];
        if (id in this.events) {
            this.events[id](data.slice(1));
        }
    }
    log(data) {
        const json = JSON.parse(data.slice(0, data.length - 1).toString());
        const context = json.context;
        const message = json.message;
        const div = document.createElement('div');
        div.className = 'message-log';
        if (context) {
            const color = (type = context.type) => {
                switch (type) {
                    case 'string':
                        return '#FCF320';
                    case 'number':
                    case 'undefined':
                        return '#FF8080';
                    case 'struct':
                    case 'method':
                        return '#FFB871';
                    default:
                        return '';
                }
            };
            div.innerHTML = `<span class='ace_link'>[${context.file}:${context.line}]</span>`;
            switch (context.type) {
                case 'struct': {
                    const view = new this.JSONTreeView(`struct`, message);
                    console.log(view);
                    view.readonly = true;
                    div.appendChild(view.dom);
                    break;
                }
                default:
                    const span = document.createElement('span');
                    span.style.color = color();
                    span.innerText = message;
                    div.appendChild(span);
                    break;
            }
        }
        else {
            div.innerHTML = message;
        }
        this.container.appendChild(div);
    }
    surface(data) {
        const width = (data[1] << 8) + data[0];
        const height = (data[3] << 8) + data[2];
        const surface = data.slice(4, data.length);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        const idata = ctx.createImageData(width, height);
        idata.data.set(surface);
        ctx.putImageData(idata, 0, 0);
        const div = document.createElement('div');
        div.className = 'message-image';
        div.innerHTML = `<span>Surface: ${width}x${height}</span>`;
        div.appendChild(canvas);
        this.container.appendChild(div);
    }
}
//# sourceMappingURL=Console.js.map