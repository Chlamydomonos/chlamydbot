import type { EventObj } from '../event';

const MCL_HOST = 'mcl';
const MCL_PORT = '8765';

export const QQ = '2472884021';
export const VERIFY_KEY = 'CHLAMYDOMONOS';

export interface WsConnectSuccess {
    syncId: '';
    data: {
        code: number;
        session?: string;
    };
}

export interface WsEvent {
    syncId: '-1';
    data: EventObj;
}

export const MCL_WS_URL = `ws://${MCL_HOST}:${MCL_PORT}/all?verifyKey=${VERIFY_KEY}&qq=${QQ}`;

export const MCL_HTTP_ROOT = `http://${MCL_HOST}:${MCL_PORT}`;
