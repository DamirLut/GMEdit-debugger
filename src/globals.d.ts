/// <reference types="ace" />

type PluginState = {
  elements: [];
  data: {};
  listeners: [];
  ready: boolean;
  name: string;
  dir: string;
  config: {
    name: string;
    scripts: string[];
    stylesheets: string[];
    module?: boolean;
    git?: string;
  };
};

type PluginConfig = {
  init: (state: PluginState) => void;
};

declare class GMEdit {
  static register(name: string, config: PluginConfig);

  static on(event: 'projectClose', callback: () => void);
  static on(event: 'projectOpen', callback: () => void);
}

interface GMEdit {
  'gml.file.GmlFile': typeof GmlFile;
  'file.kind.gml.KGmlSearchResults': {
    inst: object;
  };
}

declare const $gmedit: GMEdit;

declare class GmlFile {
  static openTab(file: GmlFile);

  constructor(name: string, path: null, kind: any, data: '');

  editor: {
    element: HTMLElement;
  };
}

declare class ChromeTabs {
  constructor();

  init(
    element: HTMLElement,
    options: {
      tabOverlapDistance: number;
      multiline: boolean;
      fitText: boolean;
    },
  );

  addTab(
    tab: { title: string; favicon?: string },
    config?: { animate?: boolean; background?: boolean },
  );
  removeTab(element: HTMLElement);
}
