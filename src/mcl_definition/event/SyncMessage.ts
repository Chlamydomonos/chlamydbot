import type { MessageBase } from './base';
import type { Group, GroupMember, User } from './utils';

export interface FriendSyncMessage extends MessageBase {
    type: 'FriendSyncMessage';
    subject: User;
}

export interface GroupSyncMessage extends MessageBase {
    type: 'GroupSyncMessage';
    subject: Group;
}

export interface TempSyncMessage extends MessageBase {
    type: 'TempSyncMessage';
    subject: GroupMember;
}

export interface StrangerSyncMessage extends MessageBase {
    type: 'StrangerSyncMessage';
    subject: User;
}
