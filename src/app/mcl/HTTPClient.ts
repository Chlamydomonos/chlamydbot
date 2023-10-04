import axios from 'axios';
import {
    AllPaths as MclAllPaths,
    Api as MclApi,
    canGet as mcl_canGet,
    canPost as mcl_canPost,
    ClearPaths as MclClearPaths,
    isClear as mcl_isClear,
    MCL_HTTP_ROOT,
    Method as MclMethod,
    Methods,
    UnclearPaths as MclUnclearPaths,
} from '../../mcl_definition';
import type { ReqResBase } from '../../mcl_definition/request/base';
import EventEmitter from 'node:events';

type Mm<P extends MclAllPaths> = P extends MclClearPaths ? MclMethod<P> : Methods;

type Req<A> = A extends ReqResBase<infer R, any> ? R : never;
type Res<A> = A extends ReqResBase<any, infer R> ? R : never;

interface HTTPError {
    error: Error;
}

export const EVENT_DICT = {
    'mcl_http:Error': null as unknown as HTTPError,
};

type EventDict = typeof EVENT_DICT;
type AllEvents = keyof EventDict;

type EventObj<E extends AllEvents> = E extends keyof EventDict ? EventDict[E] : never;

export interface HttpClientEventEmitter {
    on<N extends AllEvents>(eventName: N, listener: (event: EventObj<N>) => void): this;
    emit<N extends AllEvents>(eventName: N, eventObj: EventObj<N>): boolean;
}

export interface IHttpClient {
    readonly sessionKey: string;
    send<P extends MclClearPaths, M extends Mm<P>, A extends MclApi<P, M>>(path: P, request: Req<A>): Promise<Res<A>>;
    send<P extends MclUnclearPaths, M extends 'GET' | 'POST', A extends MclApi<P, M>>(
        path: P,
        request: Req<A>,
        method: M,
    ): Promise<Res<A>>;
}

export class HTTPClient extends EventEmitter implements HttpClientEventEmitter, IHttpClient {
    sessionKey: string = '';
    async send<P extends MclAllPaths, M extends Mm<P>, A extends MclApi<P, M>>(path: P, request: Req<A>, method?: M) {
        try {
            const url = MCL_HTTP_ROOT + path;
            if (mcl_isClear(path)) {
                if (mcl_canGet(path)) {
                    return (await axios.get<Res<A>>(url, { params: request })).data;
                } else if (mcl_canPost(path)) {
                    return (await axios.post<Res<A>>(url, request)).data;
                } else {
                    const fd = new FormData();
                    for (const k in request) {
                        const v = (request as any)[k];
                        if (v instanceof Blob) {
                            fd.append(k, v);
                        } else if (typeof v == 'string' || typeof v == 'number') {
                            fd.append(k, v.toString());
                        }
                    }
                    return (await axios.post<Res<A>>(url, fd)).data;
                }
            } else if (method == 'GET') {
                return (await axios.get<Res<A>>(url, { params: request })).data;
            } else {
                return (await axios.post<Res<A>>(url, request)).data;
            }
        } catch (e) {
            if (e instanceof Error) {
                this.emit('mcl_http:Error', {
                    error: e,
                });
            }
            throw e;
        }
    }
}

export default new HTTPClient();
