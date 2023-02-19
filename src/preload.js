const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        invoke: (channel, data) => {
            let valid = ["auth-get-reply", "auth-get", "auth-save", "auth-empty"];

            if (valid.includes(channel))
                return ipcRenderer.invoke(channel, data);
        }
    }
);
