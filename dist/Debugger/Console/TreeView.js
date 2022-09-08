const SYMBOL = `__SYMBOL__`;
export class StructView {
    dom;
    constructor(source) {
        this.dom = document.createElement('div');
        this.dom.className = 'tree-struct-container';
        this.parse(source, this.dom);
    }
    parse(data, parent, key = undefined) {
        if (typeof data === 'object') {
            if (SYMBOL in data) {
                const type = data[SYMBOL].type;
                const value = data[SYMBOL].value;
                const _class = data[SYMBOL].class;
                const size = data[SYMBOL].size;
                if (typeof value === 'object') {
                    const folder = this.appendChild(key || _class || type, _class || type, size || 0);
                    if (type === 'struct') {
                        Object.entries(value).forEach(([key, value]) => {
                            this.parse(value, folder.children, key);
                        });
                    }
                    else if (Array.isArray(value)) {
                        value.forEach((element, i) => {
                            this.parse(element, folder.children, i.toString());
                        });
                    }
                    parent.appendChild(folder.container);
                }
                else {
                    let outputValue = value;
                    switch (type) {
                        case 'method': {
                            outputValue = 'function';
                            break;
                        }
                        case 'string': {
                            outputValue = `"${value}"`;
                            break;
                        }
                    }
                    parent.appendChild(this.appendValue(key, type, outputValue));
                }
            }
        }
    }
    appendChild(name, type, size) {
        const container = document.createElement('div');
        container.style.position = 'relative';
        const span = document.createElement('span');
        span.style.display = 'block';
        span.innerHTML = `<span class='struct-value'>${name}</span>: <span class='struct-value method'>${type}</span>[${size}]`;
        const children = document.createElement('div');
        children.className = 'children';
        container.appendChild(span);
        container.appendChild(children);
        span.addEventListener('click', () => {
            children.style.display = children.style.display === 'block' ? 'none' : 'block';
        });
        return { children, container };
    }
    appendValue(name, type, value) {
        const div = document.createElement('div');
        div.innerHTML = `<span class='struct-value'>${name}</span>: <span class='struct-value ${type}'>${value}</span>`;
        return div;
    }
}
//# sourceMappingURL=TreeView.js.map