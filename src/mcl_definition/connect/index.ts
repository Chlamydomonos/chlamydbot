import type { EventObj } from '../event';
import { MCL_HOST, MCL_PORT, QQ, VERIFY_KEY } from '../../config';

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
