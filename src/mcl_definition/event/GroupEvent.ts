import type { EventBase } from './base';
import type { Group, GroupMember, Permission } from './utils';

export interface BotGroupPermissionChangeEvent extends EventBase {
    type: 'BotGroupPermissionChangeEvent';
    origin: Permission;
    current: Permission;
}

export interface BotMuteEvent extends EventBase {
    type: 'BotMuteEvent';
    durationSeconds: number;
    operator?: GroupMember;
}

export interface BotUnmuteEvent extends EventBase {
    type: 'BotUnmuteEvent';
    operator?: GroupMember;
}

export interface BotJoinGroupEvent extends EventBase {
    type: 'BotJoinGroupEvent';
    group: Group;
    invitor?: GroupMember;
}

export interface BotLeaveEventActive extends EventBase {
    type: 'BotLeaveEventActive';
    group: Group;
}

export interface BotLeaveEventKick extends EventBase {
    type: 'BotLeaveEventKick';
    group: Group;
    operator?: GroupMember;
}

export interface BotLeaveEventDisband extends EventBase {
    type: 'BotLeaveEventDisband';
    group: Group;
    operator?: GroupMember;
}

export interface GroupRecallEvent extends EventBase {
    type: 'GroupRecallEvent';
    authorId: number;
    messageId: number;
    time: number;
    group: Group;
    operator?: GroupMember;
}

export interface NudgeEvent extends EventBase {
    type: 'NudgeEvent';
    fromId: number;
    subject: {
        id: number;
        kind: 'Friend' | 'Group';
    };
    action: string;
    suffix: string;
    target: number;
}

export interface GroupNameChangeEvent extends EventBase {
    type: 'GroupNameChangeEvent';
    origin: string;
    current: string;
    group: Group;
    operator?: GroupMember;
}

export interface GroupEntranceAnnouncementChangeEvent extends EventBase {
    type: 'GroupEntranceAnnouncementChangeEvent';
    origin: string;
    current: string;
    group: Group;
    operator?: GroupMember;
}

export interface GroupMuteAllEvent extends EventBase {
    type: 'GroupMuteAllEvent';
    origin: boolean;
    current: boolean;
    group: Group;
    operator?: GroupMember;
}

export interface GroupAllowAnonymousChatEvent extends EventBase {
    type: 'GroupAllowAnonymousChatEvent';
    origin: boolean;
    current: boolean;
    group: Group;
    operator?: GroupMember;
}

export interface GroupAllowConfessTalkEvent extends EventBase {
    type: 'GroupAllowConfessTalkEvent';
    origin: boolean;
    current: boolean;
    group: Group;
    isByBot: boolean;
}

export interface GroupAllowMemberInviteEvent extends EventBase {
    type: 'GroupAllowMemberInviteEvent';
    origin: boolean;
    current: boolean;
    group: Group;
    operator?: GroupMember;
}

export interface MemberJoinEvent extends EventBase {
    type: 'MemberJoinEvent';
    member: GroupMember;
    invitor?: GroupMember;
}

export interface MemberLeaveEventKick extends EventBase {
    type: 'MemberLeaveEventKick';
    member: GroupMember;
    operator?: GroupMember;
}

export interface MemberLeaveEventQuit extends EventBase {
    type: 'MemberLeaveEventQuit';
    member: GroupMember;
}

export interface MemberCardChangeEvent extends EventBase {
    type: 'MemberCardChangeEvent';
    origin: string;
    current: string;
    member: GroupMember;
}

export interface MemberSpecialTitleChangeEvent extends EventBase {
    type: 'MemberSpecialTitleChangeEvent';
    origin: string;
    current: string;
    member: GroupMember;
}

export interface MemberPermissionChangeEvent extends EventBase {
    type: 'MemberPermissionChangeEvent';
    origin: Permission;
    current: Permission;
    member: GroupMember;
}

export interface MemberMuteEvent extends EventBase {
    type: 'MemberMuteEvent';
    durationSeconds: number;
    member: GroupMember;
    operator?: GroupMember;
}

export interface MemberUnmuteEvent extends EventBase {
    type: 'MemberUnmuteEvent';
    member: GroupMember;
    operator?: GroupMember;
}

export interface MemberHonorChangeEvent extends EventBase {
    type: 'MemberHonorChangeEvent';
    member: GroupMember;
    action: 'achieve' | 'lose';
    honor: string;
}
