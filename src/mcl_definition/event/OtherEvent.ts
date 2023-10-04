import type { MsgChainObj } from '.';
import type { EventBase } from './base';
import type { MsgSource } from './MsgChainObj';
import type { Client, GroupMember, User } from './utils';

export interface NewFriendRequestEvent extends EventBase {
    type: 'NewFriendRequestEvent';
    eventId: number;
    fromId: number;
    groupId: number;
    nick: string;
    message: string;
}

export interface MemberJoinRequestEvent extends EventBase {
    type: 'MemberJoinRequestEvent';
    eventId: number;
    fromId: number;
    groupId: number;
    groupName: string;
    nick: string;
    message: string;
}

export interface BotInvitedJoinGroupRequestEvent extends EventBase {
    type: 'BotInvitedJoinGroupRequestEvent';
    eventId: number;
    fromId: number;
    groupId: number;
    groupName: string;
    nick: string;
    message: string;
}

export interface OtherClientOnlineEvent extends EventBase {
    type: 'OtherClientOnlineEvent';
    client: Client;
    kind?: number;
}

export interface OtherClientOfflineEvent extends EventBase {
    type: 'OtherClientOfflineEvent';
    client: Client;
}

export interface CommandExecutedEvent extends EventBase {
    type: 'CommandExecutedEvent';
    name: string;
    friend?: User;
    member?: GroupMember;
    args: [MsgSource, ...MsgChainObj[]];
}
