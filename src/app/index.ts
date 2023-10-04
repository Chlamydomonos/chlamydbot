import type { Axios } from 'axios';
import axios from 'axios';
import GlobalEventEmitter, { ICoreEventEmitter } from '../event/GlobalEventEmitter';
import { MCL_WS_URL, QQ, VERIFY_KEY } from '../mcl_definition';

import type { HTTPClient, IHttpClient } from './mcl/HTTPClient';
import MclHTTPClient from './mcl/HTTPClient';
import MclWSClient from './mcl/WSClient';
import backend from './backend';

export interface IApp {
    mclHttpClient: IHttpClient;
    eventEmitter: ICoreEventEmitter;
    axios: Axios;
    states: Record<string, any>;
    backend: typeof backend;
}

export class App implements IApp {
    mclWsClient: MclWSClient;
    mclHttpClient: HTTPClient;
    eventEmitter: GlobalEventEmitter;
    axios: Axios;
    states: Record<string, any>;
    backend: typeof backend;

    constructor() {
        this.mclWsClient = new MclWSClient(MCL_WS_URL);
        this.mclHttpClient = MclHTTPClient;
        this.eventEmitter = new GlobalEventEmitter();
        this.axios = axios;
        this.states = {};
        this.backend = backend;
    }

    async start() {
        console.log('Starting global event emitter...');
        this.eventEmitter.start();

        console.log('Starting mcl ws client...');
        this.mclWsClient.start();

        console.log('Starting mcl http client...');
        try {
            const verifyRes = await this.mclHttpClient.send('/verify', {
                verifyKey: VERIFY_KEY,
            });
            if (verifyRes.code != 0) {
                throw new Error(`Verify response code is ${verifyRes.code}: ${verifyRes.msg}`);
            }
            const bindRes = await this.mclHttpClient.send('/bind', {
                sessionKey: verifyRes.session,
                qq: parseInt(QQ),
            });
            if (bindRes.code != 0) {
                throw new Error(`Bind response data is ${bindRes.code}: ${bindRes.msg}`);
            }
            this.mclHttpClient.sessionKey = verifyRes.session;
        } catch (e) {
            console.log(`Start mcl http client failed: ${e}`);
            this.stop();
        }
    }

    async startPhase2() {
        console.log('Starting backend...');
        backend.listen(8766, () => {
            console.log('Backend started.');
        });
    }

    async stop() {
        console.log('Stopping mcl http client...');
        this.mclHttpClient.send('/release', {
            sessionKey: this.mclHttpClient.sessionKey,
            qq: parseInt(QQ),
        });

        console.log('Stopping mcl ws client...');
        this.mclWsClient.stop();
    }
}

export default new App();
