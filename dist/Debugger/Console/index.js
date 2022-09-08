import { StructView } from './TreeView.js';
var ConsoleEvent;
(function (ConsoleEvent) {
    ConsoleEvent[ConsoleEvent["Log"] = 0] = "Log";
    ConsoleEvent[ConsoleEvent["Surface"] = 1] = "Surface";
})(ConsoleEvent || (ConsoleEvent = {}));
export class Console {
    container;
    events = {};
    toolbar;
    logList;
    constructor(container, node_modules) {
        this.container = container;
        this.events[ConsoleEvent.Log] = this.log.bind(this);
        this.events[ConsoleEvent.Surface] = this.surface.bind(this);
        this.toolbar = document.createElement('div');
        this.logList = document.createElement('div');
        container.appendChild(this.toolbar);
        container.appendChild(this.logList);
        this.toolbar.className = 'console-toolbar';
        this.logList.style.marginTop = '30px';
        container.classList.add('console-container');
        this.addToolbar('clear', () => {
            this.logList.innerHTML = '';
        });
    }
    addToolbar(title, onClick) {
        const button = document.createElement('button');
        button.innerHTML = title;
        button.addEventListener('click', onClick);
        this.toolbar.appendChild(button);
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
        if (context.type !== 'struct') {
            const lastLog = this.logList.children[this.logList.children.length - 1];
            if (lastLog.classList.contains('message-log')) {
                const lastMessage = lastLog.querySelector('.message-value')?.innerText || '';
                if (lastMessage == message) {
                    const counter = Number(lastLog.getAttribute('count')) || 1;
                    lastLog.setAttribute('count', (counter + 1).toString());
                    return;
                }
            }
        }
        const div = document.createElement('div');
        div.setAttribute('level', context.level);
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
                    const view = new StructView(message);
                    div.appendChild(view.dom);
                    break;
                }
                default:
                    const span = document.createElement('span');
                    span.style.color = color();
                    span.innerText = message;
                    span.className = 'message-value';
                    div.appendChild(span);
                    break;
            }
        }
        else {
            div.innerHTML = message;
        }
        this.logList.appendChild(div);
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
        this.logList.appendChild(div);
    }
}
//# sourceMappingURL=index.js.map