export const EVENT_NAME = {
    EDIT: 'edit',
    DOWNLOAD: 'download',
    CHART_CHANGED: 'chart_changed',
    TAB_CHANGED: 'tab_changed',
    THEME_CHANGED: 'theme_changed',
    UPDATE: 'update',
}

export const EVENT_CONFIG = {
    [EVENT_NAME.EDIT]: {
        // "EventTargetId": "",
        "runtimeEventKey": EVENT_NAME.EDIT,
        "nativeEventKey": "click",
        "dataEventKey": [],
        "parameters": {
            "markdown" : "", 
        }
    },
    [EVENT_NAME.DOWNLOAD]: {
        "runtimeEventKey": "download",
        "nativeEventKey": "click",
        "dataEventKey": [],
    },
    [EVENT_NAME.CHART_CHANGED]: {
        "runtimeEventKey": EVENT_NAME.CHART_CHANGED,
        "nativeEventKey": "click",
        "dataEventKey": [],
        "parameters": {
            "chartTypes": [],
        }
    },
    [EVENT_NAME.TAB_CHANGED]: {
        "runtimeEventKey": EVENT_NAME.TAB_CHANGED,  
        "nativeEventKey": "click",
        "dataEventKey": [],
        "parameters": {
            "dataKey": "",
            "tabKey": "",
        }
    },
    [EVENT_NAME.THEME_CHANGED]: {
        "runtimeEventKey": EVENT_NAME.THEME_CHANGED,
        "nativeEventKey": 'contextmenu',
        "dataEventKey": [],
        "parameters": {
            "imageUrl": "",
        }
    },
    [EVENT_NAME.UPDATE]: {
        "runtimeEventKey": EVENT_NAME.UPDATE,
        "nativeEventKey": 'mouseenter',
        "dataEventKey": [],
        "parameters": {
            "markdown": "",
            "cardId": ""
        }
    }
}