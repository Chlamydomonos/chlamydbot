import type { Code } from './utils';

export interface ReqResBase<T, U> {
    request: T;
    response: U;
}

export interface ResponseBase {
    code: Code;
    msg?: string;
}

export interface SessionReqBase {
    sessionKey: string;
}

export interface MsgSendBase {
    type: string;
}
