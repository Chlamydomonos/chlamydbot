import type {
    BotOfflineEventActive,
    BotOfflineEventDropped,
    BotOfflineEventForce,
    BotOnlineEvent,
    BotReloginEvent,
} from './BotEvent';
import type {
    FriendInputStatusChangedEvent,
    FriendNickChangedEvent,
    FriendRecallEvent,
} from './FriendEvent';
import type {
    BotGroupPermissionChangeEvent,
    BotJoinGroupEvent,
    BotLeaveEventActive,
    BotLeaveEventDisband,
    BotLeaveEventKick,
    BotMuteEvent,
    BotUnmuteEvent,
    GroupAllowAnonymousChatEvent,
    GroupAllowConfessTalkEvent,
    GroupAllowMemberInviteEvent,
    GroupEntranceAnnouncementChangeEvent,
    GroupMuteAllEvent,
    GroupNameChangeEvent,
    GroupRecallEvent,
    MemberCardChangeEvent,
    MemberHonorChangeEvent,
    MemberJoinEvent,
    MemberLeaveEventKick,
    MemberLeaveEventQuit,
    MemberMuteEvent,
    MemberPermissionChangeEvent,
    MemberSpecialTitleChangeEvent,
    MemberUnmuteEvent,
    NudgeEvent,
} from './GroupEvent';
import type {
    FriendMessage,
    GroupMessage,
    OtherClientMessage,
    StrangerMessage,
    TempMessage,
} from './Message';
import type {
    MsgApp,
    MsgAt,
    MsgAtAll,
    MsgDice,
    MsgFace,
    MsgFile,
    MsgFlashImage,
    MsgForwardMessage,
    MsgImage,
    MsgJson,
    MsgMarketFace,
    MsgMiraiCode,
    MsgMusicShare,
    MsgPlain,
    MsgPoke,
    MsgQuote,
    MsgSource,
    MsgVoice,
    MsgXml,
} from './MsgChainObj';
import type {
    BotInvitedJoinGroupRequestEvent,
    CommandExecutedEvent,
    MemberJoinRequestEvent,
    NewFriendRequestEvent,
    OtherClientOfflineEvent,
    OtherClientOnlineEvent,
} from './OtherEvent';
import type {
    FriendSyncMessage,
    GroupSyncMessage,
    StrangerSyncMessage,
    TempSyncMessage,
} from './SyncMessage';

export type MsgChainObj =
    | MsgSource
    | MsgQuote
    | MsgAt
    | MsgAtAll
    | MsgFace
    | MsgPlain
    | MsgImage
    | MsgFlashImage
    | MsgVoice
    | MsgXml
    | MsgJson
    | MsgApp
    | MsgPoke
    | MsgDice
    | MsgMarketFace
    | MsgMusicShare
    | MsgForwardMessage
    | MsgFile
    | MsgMiraiCode;

export const EVENT_DICT = {
    'mcl:BotOnlineEvent': null as unknown as BotOnlineEvent,
    'mcl:BotOfflineEventActive': null as unknown as BotOfflineEventActive,
    'mcl:BotOfflineEventForce': null as unknown as BotOfflineEventForce,
    'mcl:BotOfflineEventDropped': null as unknown as BotOfflineEventDropped,
    'mcl:BotReloginEvent': null as unknown as BotReloginEvent,
    'mcl:FriendInputStatusChangedEvent':
        null as unknown as FriendInputStatusChangedEvent,
    'mcl:FriendNickChangedEvent': null as unknown as FriendNickChangedEvent,
    'mcl:FriendRecallEvent': null as unknown as FriendRecallEvent,
    'mcl:BotGroupPermissionChangedEvent':
        null as unknown as BotGroupPermissionChangeEvent,
    'mcl:BotMuteEvent': null as unknown as BotMuteEvent,
    'mcl:BotUnmuteEvent': null as unknown as BotUnmuteEvent,
    'mcl:BotJoinGroupEvent': null as unknown as BotJoinGroupEvent,
    'mcl:BotLeaveEventActive': null as unknown as BotLeaveEventActive,
    'mcl:BotLeaveEventKick': null as unknown as BotLeaveEventKick,
    'mcl:BotLeaveEventDisband': null as unknown as BotLeaveEventDisband,
    'mcl:GroupRecallEvent': null as unknown as GroupRecallEvent,
    'mcl:NudgeEvent': null as unknown as NudgeEvent,
    'mcl:GroupNameChangeEvent': null as unknown as GroupNameChangeEvent,
    'mcl:GroupEntranceAnnouncementChangeEvent':
        null as unknown as GroupEntranceAnnouncementChangeEvent,
    'mcl:GroupMuteAllEvent': null as unknown as GroupMuteAllEvent,
    'mcl:GroupAllowAnonymousChatEvent':
        null as unknown as GroupAllowAnonymousChatEvent,
    'mcl:GroupAllowConfessTalkEvent':
        null as unknown as GroupAllowConfessTalkEvent,
    'mcl:GroupAllowMemberInviteEvent':
        null as unknown as GroupAllowMemberInviteEvent,
    'mcl:MemberJoinEvent': null as unknown as MemberJoinEvent,
    'mcl:MemberLeaveEventKick': null as unknown as MemberLeaveEventKick,
    'mcl:MemberLeaveEventQuit': null as unknown as MemberLeaveEventQuit,
    'mcl:MemberCardChangeEvent': null as unknown as MemberCardChangeEvent,
    'mcl:MemberSpecialTitleChangeEvent':
        null as unknown as MemberSpecialTitleChangeEvent,
    'mcl:MemberPermissionChangeEvent':
        null as unknown as MemberPermissionChangeEvent,
    'mcl:MemberMuteEvent': null as unknown as MemberMuteEvent,
    'mcl:MemberUnmuteEvent': null as unknown as MemberUnmuteEvent,
    'mcl:MemberHonorChangeEvent': null as unknown as MemberHonorChangeEvent,
    'mcl:NewFriendRequestEvent': null as unknown as NewFriendRequestEvent,
    'mcl:MemberJoinRequestEvent': null as unknown as MemberJoinRequestEvent,
    'mcl:BotInvitedJoinGroupRequestEvent':
        null as unknown as BotInvitedJoinGroupRequestEvent,
    'mcl:OtherClientOnlineEvent': null as unknown as OtherClientOnlineEvent,
    'mcl:OtherClientOfflineEvent': null as unknown as OtherClientOfflineEvent,
    'mcl:CommandExecutedEvent': null as unknown as CommandExecutedEvent,
    'mcl:FriendMessage': null as unknown as FriendMessage,
    'mcl:GroupMessage': null as unknown as GroupMessage,
    'mcl:TempMessage': null as unknown as TempMessage,
    'mcl:StrangerMessage': null as unknown as StrangerMessage,
    'mcl:OtherClientMessage': null as unknown as OtherClientMessage,
    'mcl:FriendSyncMessage': null as unknown as FriendSyncMessage,
    'mcl:GroupSyncMessage': null as unknown as GroupSyncMessage,
    'mcl:TempSyncMessage': null as unknown as TempSyncMessage,
    'mcl:StrangerSyncMessage': null as unknown as StrangerSyncMessage,
};

export type EventDict = typeof EVENT_DICT;

export type EventObj = EventDict[keyof EventDict];

export type EventNames = keyof EventDict;

export function isEventName(name: string): name is EventNames {
    return name in EVENT_DICT;
}
