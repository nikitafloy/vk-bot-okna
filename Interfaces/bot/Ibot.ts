import {Ictx} from './Ictx';
export interface Ibot {
    use?: (func: () => Object) => Object,
    command?: (cmd: String, func: (ctx: Ictx) => void) => void,
    startPolling?: (cb: (error: String) => void) => void,
    on?: (func: (ctx: Ictx) => Promise<any>) => void,
};