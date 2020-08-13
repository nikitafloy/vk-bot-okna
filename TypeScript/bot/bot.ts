import {ctx} from './ctx';
export interface bot {
    use?: (func: () => Object) => Object,
    command?: (cmd: String, func: (ctx: ctx) => void) => void,
    startPolling?: (cb: (error: String) => void) => void,
    on?: (func: (ctx: ctx) => Promise<any>) => void,
};