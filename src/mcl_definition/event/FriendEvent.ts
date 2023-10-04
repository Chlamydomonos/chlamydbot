import type { EventBase, FriendEventBase } from './base';

export interface FriendInputStatusChangedEvent extends FriendEventBase {
    type: 'FriendInputStatusChangedEvent';
    inputting: boolean;
}

export interface FriendNickChangedEvent extends FriendEventBase {
    type: 'FriendNickChangedEvent';
    from: string;
    to: string;
}

export interface FriendRecallEvent extends EventBase {
    type: 'FriendRecallEvent';
    authorId: number;
    messageId: number;
    time: number;
    operator: number;
}
