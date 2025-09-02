export const EVENT_NAME = {
    EDIT: 'edit',
    DOWNLOAD: 'download',
}


export const EVENT_CONFIG = {
    [EVENT_NAME.EDIT]: {
        // "EventTargetId": "",
        "runtimeEventKey": "edit",
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
    }
}