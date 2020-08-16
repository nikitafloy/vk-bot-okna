import {ICtx} from './Ictx';
export interface IBot {
    use?: (func: () => Object) => Object,
    command?: (cmd: String, func: (ctx: ICtx) => void) => void,
    startPolling?: (cb: (error: String) => void) => void,
    on?: (func: (ctx: ICtx) => Promise<any>) => void,
};