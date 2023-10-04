import type { MsgChainSend } from '.';
import type { MsgChainObj } from '../event';
import type { MsgSource } from '../event/MsgChainObj';
import type { ReqResBase, ResponseBase, SessionReqBase } from './base';

interface SendFriendMessageReq1 extends SessionReqBase {
    target: number;
    quote?: number;
    messageChain: MsgChainSend[];
}

interface SendFriendMessageReq2 extends SessionReqBase {
    qq: number;
    quote?: number;
    messageChain: MsgChainSend[];
}

export type SendFriendMessageReq = SendFriendMessageReq1 | SendFriendMessageReq2;

export interface SendFriendMessageRes extends ResponseBase {
    messageId: number;
}

export interface SendFriendMessage extends ReqResBase<SendFriendMessageReq, SendFriendMessageRes> {}

interface SendGroupMessageReq1 extends SessionReqBase {
    target: number;
    quote?: number;
    messageChain: MsgChainSend[];
}

interface SendGroupMessageReq2 extends SessionReqBase {
    group: number;
    quote?: number;
    messageChain: MsgChainSend[];
}

export type SendGroupMessageReq = SendGroupMessageReq1 | SendFriendMessageReq2;

export interface SendGroupMessageRes extends ResponseBase {
    messageId: number;
}

export interface SendGroupMessage extends ReqResBase<SendGroupMessageReq, SendGroupMessageRes> {}

export interface SendTempMessageReq extends SessionReqBase {
    qq: number;
    group: number;
    quote?: number;
    messageChain: MsgChainSend[];
}

export interface SendTempMessageRes extends ResponseBase {
    messageId: number;
}

export interface SendTempMessage extends ReqResBase<SendTempMessageReq, SendTempMessageRes> {}

export interface SendNudgeReq extends SessionReqBase {
    target: number;
    subject: number;
    kind: 'Friend' | 'Group' | 'Stranger';
}

export interface SendNudge extends ReqResBase<SendNudgeReq, ResponseBase> {}

export interface RecallReq extends SessionReqBase {
    target: number;
    messageId: number;
}

export interface Recall extends ReqResBase<RecallReq, ResponseBase> {}

export interface RoamingMessagesReq {
    timeStart: number;
    timeEnd: number;
    target: number;
}

export interface RoamingMessagesRes extends ResponseBase {
    data: [MsgSource, ...MsgChainObj[]];
}

export interface RoamingMessages extends ReqResBase<RoamingMessagesReq, RoamingMessagesRes> {}
