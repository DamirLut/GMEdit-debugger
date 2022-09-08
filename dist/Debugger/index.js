import { GMEditModule } from '../main.js';
import { Console } from './Console/index.js';
export class Debugger {
    file;
    page;
    tabContainer;
    container;
    tabs;
    tabsList = {};
    logger;
    node_modules;
    constructor(node_modules) {
        this.node_modules = node_modules;
        this.file = new $gmedit['gml.file.GmlFile']('Debugger', null, $gmedit['file.kind.gml.KGmlSearchResults'].inst, '');
        this.page = document.createElement('div');
        this.page.style.overflow = 'auto';
        this.page.style.position = 'relative';
        this.container = document.createElement('div');
        this.file.editor.element = this.page;
        $gmedit['gml.file.GmlFile'].openTab(this.file);
        this.initTabs();
        const tabs = this.page.querySelector('.chrome-tabs');
        tabs.style.position = 'fixed';
        tabs.style.width = '100%';
        this.container.style.marginTop = tabs.getBoundingClientRect().height + 'px';
        this.addTab('Console', GMEditModule.Console, Console);
        //this.addTab('Instances', GMEditModule.Console, Console);
        //this.addTab('Room Viewer', GMEditModule.Console, Console);
    }
    process(module, data) {
        Object.values(this.tabsList).forEach((value) => {
            if (value.module === module) {
                value.page.process(data);
            }
        });
    }
    initTabs() {
        this.tabContainer = document.createElement('div');
        const className = document.getElementById('tabs').className;
        this.tabContainer.className = className.replace('has-system-buttons', '');
        this.tabContainer.style.setProperty('--tab-content-margin', '9px');
        this.tabContainer.innerHTML = `

      <div class="chrome-tabs-content"></div>
      <div class="chrome-tabs-bottom-bar"></div>
    `;
        this.page.appendChild(this.tabContainer);
        this.page.appendChild(this.container);
        this.tabs = new ChromeTabs();
        this.tabs.init(this.tabContainer, {
            tabOverlapDistance: 20,
            multiline: true,
            fitText: true,
        });
        this.tabContainer.addEventListener('activeTabChange', ({ detail }) => {
            const tabId = detail.tabEl.innerText.trim();
            Object.entries(this.tabsList).forEach(([key, { container }]) => {
                container.style.display = tabId === key ? 'block' : 'none';
            });
        });
    }
    addTab(title, module, builder) {
        const container = document.createElement('div');
        container.style.overflow = 'auto';
        this.tabsList[title] = { container, page: new builder(container, this.node_modules), module };
        this.container.appendChild(container);
        this.tabs.addTab({
            title,
            favicon: '',
        });
        /// Hide 'Close' buttons
        this.tabContainer.querySelectorAll('.chrome-tab').forEach((child) => {
            const closeButton = child.querySelector('.chrome-tab-close');
            if (closeButton) {
                closeButton.style.display = 'none';
            }
        });
    }
}
//# sourceMappingURL=index.js.map