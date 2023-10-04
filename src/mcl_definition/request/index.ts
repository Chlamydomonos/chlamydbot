import type {
    BotProfile,
    DeleteFriend,
    FriendList,
    FriendProfile,
    GroupList,
    MemberList,
    MemberProfile,
    RespBotInvitedJoinGroupRequestEvent,
    RespMemberJoinRequestEvent,
    RespNewFriendRequestEvent,
    UserProfile,
} from './Account';
import type { ReqResBase } from './base';
import type {
    FileDelete,
    FileInfo,
    FileList,
    FileMkdir,
    FileMove,
    FileRename,
    FileUpload,
    UploadImage,
    UploadVoice,
} from './File';
import type {
    AnnoDelete,
    AnnoList,
    AnnoPublish,
    GetGroupConfig,
    GetMemberInfo,
    Kick,
    MemberAdmin,
    Mute,
    MuteAll,
    PostGroupConfig,
    PostMemberInfo,
    Quit,
    SetEssence,
    Unmute,
    UnmuteAll,
} from './Group';
import type {
    Recall,
    RoamingMessages,
    SendFriendMessage,
    SendGroupMessage,
    SendNudge,
    SendTempMessage,
} from './Message';
import type {
    App,
    At,
    AtAll,
    Dice,
    Face1,
    Face2,
    FlashImage1,
    FlashImage2,
    FlashImage3,
    FlashImage4,
    ForwardMessage1,
    ForwardMessage2,
    Image1,
    Image2,
    Image3,
    Image4,
    Json,
    MiraiCode,
    MusicShare,
    Plain,
    Poke,
    Quote,
    Voice1,
    Voice2,
    Voice3,
    Voice4,
    Xml,
} from './MsgChainSend';
import type { About, Bind, BotList, MessageFormId, Release, SessionInfo, Verify } from './Session';

export type MsgChainSend =
    | Quote
    | At
    | AtAll
    | Face1
    | Face2
    | Plain
    | Image1
    | Image2
    | Image3
    | Image4
    | FlashImage1
    | FlashImage2
    | FlashImage3
    | FlashImage4
    | Voice1
    | Voice2
    | Voice3
    | Voice4
    | Xml
    | Json
    | App
    | Poke
    | Dice
    | MusicShare
    | ForwardMessage1
    | ForwardMessage2
    | File
    | MiraiCode;

const API_DICT = {
    '/verify$POST': null as unknown as Verify,
    '/bind$POST': null as unknown as Bind,
    '/sessionInfo$GET': null as unknown as SessionInfo,
    '/release$POST': null as unknown as Release,
    '/about$GET': null as unknown as About,
    '/botList$GET': null as unknown as BotList,
    '/messageFromId$GET': null as unknown as MessageFormId,
    '/friendList$GET': null as unknown as FriendList,
    '/groupList$GET': null as unknown as GroupList,
    '/memberList$GET': null as unknown as MemberList,
    '/botProfile$GET': null as unknown as BotProfile,
    '/friendProfile$GET': null as unknown as FriendProfile,
    '/memberProfile$GET': null as unknown as MemberProfile,
    '/userProfile$GET': null as unknown as UserProfile,
    '/deleteFriend$POST': null as unknown as DeleteFriend,
    '/resp/newFriendRequestEvent$POST': null as unknown as RespNewFriendRequestEvent,
    '/resp/memberJoinRequestEvent$POST': null as unknown as RespMemberJoinRequestEvent,
    '/resp/botInvitedJoinGroupRequestEvent$POST': null as unknown as RespBotInvitedJoinGroupRequestEvent,
    '/file/list$GET': null as unknown as FileList,
    '/file/info$GET': null as unknown as FileInfo,
    '/file/mkdir$POST': null as unknown as FileMkdir,
    '/file/delete$POST': null as unknown as FileDelete,
    '/file/move$POST': null as unknown as FileMove,
    '/file/rename$POST': null as unknown as FileRename,
    '/uploadImage$POSTf': null as unknown as UploadImage,
    '/uploadVoice$POSTf': null as unknown as UploadVoice,
    '/file/upload$POSTf': null as unknown as FileUpload,
    '/mute$POST': null as unknown as Mute,
    '/unmute$POST': null as unknown as Unmute,
    '/kick$POST': null as unknown as Kick,
    '/quit$POST': null as unknown as Quit,
    '/muteAll$POST': null as unknown as MuteAll,
    '/unmuteAll$POST': null as unknown as UnmuteAll,
    '/setEssence$POST': null as unknown as SetEssence,
    '/groupConfig$GET': null as unknown as GetGroupConfig,
    '/groupConfig$POST': null as unknown as PostGroupConfig,
    '/memberInfo$GET': null as unknown as GetMemberInfo,
    '/memberInfo$POST': null as unknown as PostMemberInfo,
    '/memberAdmin$POST': null as unknown as MemberAdmin,
    '/anno/list$GET': null as unknown as AnnoList,
    '/anno/publish$POST': null as unknown as AnnoPublish,
    '/anno/delete$POST': null as unknown as AnnoDelete,
    '/sendFriendMessage$POST': null as unknown as SendFriendMessage,
    '/sendGroupMessage$POST': null as unknown as SendGroupMessage,
    '/sendTempMessage$POST': null as unknown as SendTempMessage,
    '/sendNudge$POST': null as unknown as SendNudge,
    '/recall$POST': null as unknown as Recall,
    '/roamingMessages$POST': null as unknown as RoamingMessages,
};

export type Methods = 'GET' | 'POST' | 'POSTf';

type ApiDict = typeof API_DICT;

export type AllApis = ApiDict[keyof ApiDict];

type CatTemp<T extends string, U extends Methods> = `${T}\$${U}`;

export type HasApi<T extends string, U extends Methods> = CatTemp<T, U> extends keyof ApiDict
    ? ApiDict[CatTemp<T, U>]
    : never;

export type AllPaths = keyof ApiDict extends CatTemp<infer R, Methods> ? R : never;

type GetDict = {
    [K in keyof ApiDict]: K extends CatTemp<infer R, 'GET'> ? R : never;
};

export type GetPaths = GetDict[keyof GetDict];

type PostDict = {
    [K in keyof ApiDict]: K extends CatTemp<infer R, 'POST'> ? R : never;
};

export type PostPaths = PostDict[keyof PostDict];

type FileDict = {
    [K in keyof ApiDict]: K extends CatTemp<infer R, 'POSTf'> ? R : never;
};

export type FilePaths = FileDict[keyof FileDict];

type UnclearDict = {
    [K in keyof ApiDict]: K extends CatTemp<infer R, 'GET'>
        ? CatTemp<R, 'POST'> extends keyof ApiDict
            ? R
            : never
        : never;
};

export type UnclearPaths = UnclearDict[keyof UnclearDict];
export type ClearPaths = Exclude<AllPaths, UnclearPaths>;

export type Api<P extends AllPaths, M extends Methods> = CatTemp<P, M> extends keyof ApiDict
    ? ApiDict[CatTemp<P, M>]
    : never;

type ClearMethodDict = {
    [K in ClearPaths]: K extends GetPaths ? 'GET' : K extends PostPaths ? 'POST' : 'POSTf';
};

type UnclearMethodDict = {
    [K in UnclearPaths]: 'GET' | 'POST';
};

type MethodDict = ClearMethodDict & UnclearMethodDict;

export type Method<P extends AllPaths> = MethodDict[P];

export type ClearMethod<P extends ClearPaths> = ClearMethodDict[P];

export function canGet(path: AllPaths): path is GetPaths {
    return `${path}\$GET` in API_DICT;
}

export function canPost(path: AllPaths): path is PostPaths {
    return `${path}\$POST` in API_DICT;
}

export function canPostF(path: AllPaths): path is PostPaths {
    return `${path}\$POSTf` in API_DICT;
}

export function isUnclear(path: AllPaths): path is UnclearPaths {
    return canGet(path) && canPost(path);
}

export function isClear(path: AllPaths): path is ClearPaths {
    return !isUnclear(path);
}
