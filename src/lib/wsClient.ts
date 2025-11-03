// Small module to expose a send function that can be set by the WS hook
let sendFn: (obj: unknown) => boolean = () => false;

export const setSend = (fn: (obj: unknown) => boolean) => {
  sendFn = fn;
};

export const send = (obj: unknown) => sendFn(obj);

const wsClient = { setSend, send };

export default wsClient;
