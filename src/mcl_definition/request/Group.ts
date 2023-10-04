import type { Group, Permission } from '../event/utils';
import type { ReqResBase, ResponseBase, SessionReqBase } from './base';
import type { Anno, GroupConfig } from './utils';

export interface MuteReq extends SessionReqBase {
    target: number;
    memberId: number;
    time?: number;
}

export interface Mute extends ReqResBase<MuteReq, ResponseBase> {}

export interface UnmuteReq extends SessionReqBase {
    target: number;
    memberId: number;
}

export interface Unmute extends ReqResBase<UnmuteReq, ResponseBase> {}

export interface KickReq extends SessionReqBase {
    target: number;
    memberId: number;
    msg?: string;
}

export interface Kick extends ReqResBase<KickReq, ResponseBase> {}

export interface QuitReq extends SessionReqBase {
    target: number;
}

export interface Quit extends ReqResBase<QuitReq, ResponseBase> {}

export interface MuteAllReq extends SessionReqBase {
    target: number;
}

export interface MuteAll extends ReqResBase<MuteAllReq, ResponseBase> {}

export interface UnmuteAll extends ReqResBase<MuteAllReq, ResponseBase> {}

export interface SetEssenceReq extends SessionReqBase {
    messageId: number;
    target: number;
}

export interface SetEssence extends ReqResBase<SetEssenceReq, ResponseBase> {}

export interface GetGroupConfigReq extends SessionReqBase {
    target: number;
}

export interface GetGroupConfig
    extends ReqResBase<GetGroupConfigReq, GroupConfig> {}

export interface PostGroupConfigReq extends SessionReqBase {
    target: number;
    config: Partial<GroupConfig>;
}

export interface PostGroupConfig
    extends ReqResBase<PostGroupConfigReq, ResponseBase> {}

export interface GetMemberInfoReq extends SessionReqBase {
    target: number;
    memberId: number;
}

export interface GetMemberInfoRes {
    id: number;
    memberName: string;
    specialTitle: string;
    permission: Permission;
    joinTimestamp: number;
    lastSpeakTimestamp: number;
    muteTimeRemaining: number;
    group: Group;
}

export interface GetMemberInfo
    extends ReqResBase<GetMemberInfoReq, GetMemberInfoRes> {}

export interface PostMemberInfoReq extends SessionReqBase {
    target: number;
    memberId: number;
    info: {
        name?: string;
        specialTitle?: string;
    };
}

export interface PostMemberInfo
    extends ReqResBase<PostMemberInfoReq, ResponseBase> {}

export interface MemberAdminReq extends SessionReqBase {
    target: number;
    memberId: number;
    assign: boolean;
}

export interface MemberAdmin extends ReqResBase<MemberAdminReq, ResponseBase> {}

export interface AnnoListReq extends SessionReqBase {
    id: number;
    offset?: number;
    size?: number;
}

export interface AnnoListRes extends ResponseBase {
    data: Anno[];
}

export interface AnnoList extends ReqResBase<AnnoListReq, AnnoListRes> {}

export interface AnnoPublishReq extends SessionReqBase {
    target: number;
    content: string;
    sendToNewMember?: boolean;
    pinned?: boolean;
    showEditCard?: boolean;
    showPopup?: boolean;
    requireConfirmation?: boolean;
    imageUrl?: string;
    imagePath?: string;
    imageBase64?: string;
}

export interface AnnoPublishRes extends ResponseBase {
    data: Anno[];
}

export interface AnnoPublish
    extends ReqResBase<AnnoPublishReq, AnnoPublishRes> {}

export interface AnnoDeleteReq extends SessionReqBase {
    id: number;
    fid: string;
}

export interface AnnoDelete extends ReqResBase<AnnoDeleteReq, ResponseBase> {}
