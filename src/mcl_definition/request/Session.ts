import type { MsgChainObj } from '../event';
import type { MsgSource } from '../event/MsgChainObj';
import type { ReqResBase, ResponseBase, SessionReqBase } from './base';

export interface VerifyReq {
    verifyKey: string;
}

export interface VerifyRes extends ResponseBase {
    session: string;
}

export interface Verify extends ReqResBase<VerifyReq, VerifyRes> {}

export interface BindReq extends SessionReqBase {
    qq: number;
}

export interface Bind extends ReqResBase<BindReq, ResponseBase> {}

export interface SessionInfoRes extends ResponseBase {
    data: {
        sessionKey: string;
        qq: {
            id: number;
            nickname: string;
            remark: string;
        };
    };
}

export interface SessionInfo extends ReqResBase<SessionReqBase, SessionInfoRes> {}

export interface ReleaseReq extends SessionReqBase {
    qq: number;
}

export interface Release extends ReqResBase<ReleaseReq, ResponseBase> {}

export interface AboutRes extends ResponseBase {
    data: {
        version: string;
    };
}

export interface About extends ReqResBase<undefined, AboutRes> {}

export interface BotListRes extends ResponseBase {
    data: number[];
}

export interface BotList extends ReqResBase<undefined, BotListRes> {}

export interface MessageFormIdReq extends SessionReqBase {
    messageId: number;
    target: number;
}

export interface MessageFormIdRes extends ResponseBase {
    data: {
        type: 'FriendMessage' | 'GroupMessage' | 'TempMessage' | string;
        messageChain: [MsgSource, ...MsgChainObj[]];
    };
}

export interface MessageFormId extends ReqResBase<MessageFormIdReq, MessageFormIdRes> {}
